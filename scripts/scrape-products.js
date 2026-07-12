#!/usr/bin/env node

const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");

const BASE_URL = "https://www.organicshops.cc";
const ROOT_DIR = path.resolve(__dirname, "..");
const PRODUCTS_JSON = path.join(ROOT_DIR, "src/data/products.json");
const CATEGORIES_JSON = path.join(ROOT_DIR, "src/data/categories.json");
const EXPORT_DIR = path.join(ROOT_DIR, "export");
const CSV_PATH = path.join(EXPORT_DIR, "products.csv");
const REPORT_PATH = path.join(EXPORT_DIR, "download-report.json");
const FAILED_PRODUCTS_PATH = path.join(EXPORT_DIR, "failed-products.json");
const PUBLIC_PRODUCTS_DIR = path.join(ROOT_DIR, "public/products");

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 320;
const MAX_GALLERY_IMAGES = 4;
const REQUEST_DELAY_MS = 900;
const DEFAULT_MIN_PER_CATEGORY = 3;

function parseArgs(argv) {
  const options = {
    limit: DEFAULT_LIMIT,
    force: false,
    resume: false,
    category: null,
    fillCategories: false,
    minPerCategory: DEFAULT_MIN_PER_CATEGORY,
  };

  for (const arg of argv) {
    if (arg.startsWith("--limit=")) options.limit = Number(arg.split("=")[1]);
    if (arg === "--force") options.force = true;
    if (arg === "--resume") options.resume = true;
    if (arg === "--fill-categories") options.fillCategories = true;
    if (arg.startsWith("--min-per-category=")) options.minPerCategory = Number(arg.split("=")[1]);
    if (arg.startsWith("--category=")) options.category = arg.split("=")[1];
  }

  if (!Number.isFinite(options.limit) || options.limit < 1) {
    throw new Error("--limit must be a positive number");
  }
  if (!Number.isFinite(options.minPerCategory) || options.minPerCategory < 1) {
    throw new Error("--min-per-category must be a positive number");
  }
  options.limit = Math.min(Math.floor(options.limit), MAX_LIMIT);
  options.minPerCategory = Math.floor(options.minPerCategory);
  return options;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function decodeHtml(value = "") {
  return value
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([a-f0-9]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function stripTags(html = "") {
  return decodeHtml(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeText(value = "") {
  return stripTags(value).replace(/[ \t]{2,}/g, " ").trim();
}

function stripImages(html = "") {
  return html.replace(/<img\b[^>]*>/gi, "").trim();
}

function absoluteUrl(url) {
  if (!url) return "";
  const cleanUrl = decodeHtml(url).trim();
  if (!cleanUrl || cleanUrl.startsWith("data:") || cleanUrl.startsWith("javascript:")) return "";
  return new URL(cleanUrl, BASE_URL).toString();
}

function removeQuery(url) {
  if (!url) return "";
  const parsed = new URL(url);
  parsed.search = "";
  parsed.hash = "";
  return parsed.toString();
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function uniqueBy(values, getKey) {
  const seen = new Set();
  const result = [];
  for (const value of values) {
    const key = getKey(value);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

async function fetchText(url) {
  await sleep(REQUEST_DELAY_MS);
  const response = await fetch(url, {
    headers: {
      "user-agent": "organicshops-ui product import prototype (+https://www.organicshops.cc)",
      accept: "text/html,application/xhtml+xml",
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
  return response.text();
}

async function fetchBuffer(url) {
  await sleep(REQUEST_DELAY_MS);
  const response = await fetch(url, {
    headers: {
      "user-agent": "organicshops-ui product import prototype (+https://www.organicshops.cc)",
      accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
  const arrayBuffer = await response.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuffer),
    contentType: response.headers.get("content-type") || "",
  };
}

function extractAttr(tag, attrName) {
  const pattern = new RegExp(`${attrName}\\s*=\\s*(['"])(.*?)\\1`, "i");
  const match = tag.match(pattern);
  return match ? decodeHtml(match[2]) : "";
}

function extractMeta(html, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']*)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']*)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+itemprop=["']${escaped}["'][^>]+content=["']([^"']*)["'][^>]*>`, "i"),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return decodeHtml(match[1]).trim();
  }
  return "";
}

function extractJsonLdProduct(html) {
  const scripts = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) || [];
  for (const script of scripts) {
    const jsonText = script.replace(/^<script[^>]*>/i, "").replace(/<\/script>$/i, "").trim();
    try {
      const parsed = JSON.parse(jsonText);
      const product = Array.isArray(parsed) ? parsed.find((item) => item["@type"] === "Product") : parsed;
      if (product && product["@type"] === "Product") return product;
    } catch (_error) {
      continue;
    }
  }
  return null;
}

function extractBreadcrumb(html) {
  const match = html.match(/<div id=['"]PagePath['"][^>]*>([\s\S]*?)<\/div>/i);
  if (!match) return [];
  const links = [...match[1].matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)].map((item) => normalizeText(item[1]));
  return links.filter((item) => item && item !== "首頁");
}

function extractCategoriesFromHome(html) {
  const categories = [];
  const navMatch = html.match(/<nav>[\s\S]*?<\/nav>/i);
  const nav = navMatch ? navMatch[0] : html;
  const mainPattern = /<li id='MainId_(\d+)'[^>]*><a href='([^']+)'>([\s\S]*?)<\/a>([\s\S]*?)(?=<li id='MainId_|\s*<\/ul>\s*<\/nav>)/g;
  let mainMatch;
  while ((mainMatch = mainPattern.exec(nav))) {
    const [, mainId, href, labelHtml, block] = mainMatch;
    if (!href.includes("categories.aspx")) continue;
    const categoryName = normalizeText(labelHtml.replace(/<img\b[^>]*>/gi, ""));
    categories.push({ id: mainId, url: absoluteUrl(href), categoryName, subcategoryName: "" });

    const subPattern = /<li id='SubId_(\d+)'[^>]*><a href='([^']+)'>([\s\S]*?)<\/a><\/li>/g;
    let subMatch;
    while ((subMatch = subPattern.exec(block))) {
      const [, subId, subHref, subLabel] = subMatch;
      categories.push({
        id: subId,
        url: absoluteUrl(subHref),
        categoryName,
        subcategoryName: normalizeText(subLabel),
      });
    }
  }
  return uniqueBy(categories, (category) => category.url);
}

function extractCid(url) {
  try {
    return new URL(url).searchParams.get("cid") || "";
  } catch (_error) {
    return "";
  }
}

function normalizeCategoryKey(categoryName = "", subcategoryName = "") {
  return `${categoryName.trim()} / ${subcategoryName.trim()}`;
}

function mergeUniqueStrings(existing = [], additions = []) {
  return unique([...(Array.isArray(existing) ? existing : []), ...additions]);
}

function mergeCategoryRefs(existingProduct, candidate) {
  const sourceCategories = mergeUniqueStrings(existingProduct.sourceCategories, [{
    categoryName: candidate.categoryName,
    subcategoryName: candidate.subcategoryName,
    sourceUrl: candidate.categoryUrl || candidate.sourceCategoryUrl || "",
    cid: candidate.sourceCategoryId || extractCid(candidate.categoryUrl || ""),
  }].filter((item) => item.categoryName || item.subcategoryName));

  const categoryNames = mergeUniqueStrings(existingProduct.sourceCategoryNames, [candidate.categoryName].filter(Boolean));
  const subcategoryNames = mergeUniqueStrings(existingProduct.sourceSubcategoryNames, [candidate.subcategoryName].filter(Boolean));

  return {
    ...existingProduct,
    sourceCategories,
    sourceCategoryNames: categoryNames,
    sourceSubcategoryNames: subcategoryNames,
  };
}

function extractProductCards(html, categoryContext) {
  const boxItems = html.match(/<div class='boxitem'>[\s\S]*?(?=<div class='boxitem'>|<div class=['"]page|<\/section>)/g) || [];
  return boxItems
    .map((item) => {
      const hrefMatch = item.match(/<a href='([^']*product\.aspx\?id=(\d+)[^']*)'/i);
      if (!hrefMatch) return null;
      const oldProductId = hrefMatch[2];
      const productName = normalizeText((item.match(/<h4 class='itemtitle'>([\s\S]*?)<\/h4>/i) || [])[1] || "");
      const listPrice = Number((((item.match(/origin_price[\s\S]*?<span>([\s\S]*?)<\/span>/i) || [])[1] || "").match(/\d+/g) || []).join(""));
      const memberPrice = Number((((item.match(/sale_price[\s\S]*?<span>([\s\S]*?)<\/span>/i) || [])[1] || "").match(/\d+/g) || []).join(""));
      const imgTag = (item.match(/<img\b[^>]*>/i) || [])[0] || "";
      return {
        oldProductId,
        productName,
        listPrice: Number.isFinite(listPrice) && listPrice > 0 ? listPrice : null,
        memberPrice: Number.isFinite(memberPrice) && memberPrice > 0 ? memberPrice : null,
        sourceUrl: absoluteUrl(hrefMatch[1]),
        listImageUrl: absoluteUrl(extractAttr(imgTag, "src")),
        categoryName: categoryContext.categoryName,
        subcategoryName: categoryContext.subcategoryName,
        categoryUrl: categoryContext.url || categoryContext.pageUrl || "",
        sourceCategoryId: categoryContext.id || extractCid(categoryContext.url || categoryContext.pageUrl || ""),
      };
    })
    .filter(Boolean);
}

function extractPaginationLinks(html, currentUrl) {
  const current = new URL(currentUrl);
  const currentCid = current.searchParams.get("cid");
  const links = [...html.matchAll(/<a\b[^>]+href=(['"])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi)];
  return unique(
    links
      .map((match) => ({ href: absoluteUrl(match[2]), label: normalizeText(match[3]) }))
      .filter(({ href, label }) => {
        if (!href) return false;
        const url = new URL(href);
        if (url.origin !== BASE_URL) return false;
        if (!/categories\.aspx$/i.test(url.pathname)) return false;
        if (currentCid && url.searchParams.get("cid") !== currentCid) return false;
        if (url.toString() === current.toString()) return false;
        return /page|pageno|pageindex|頁|下一|>|»/i.test(`${href} ${label}`);
      })
      .map(({ href }) => href)
  );
}

function extractElementById(html, id) {
  const pattern = new RegExp(`<([a-z0-9]+)[^>]+id=["']${id}["'][^>]*>([\\s\\S]*?)<\\/\\1>`, "i");
  const match = html.match(pattern);
  return match ? match[2] : "";
}

function extractDetailTabs(html) {
  const tabs = {};
  const detailMatch = html.match(/<div id=["']detailtabs["'][^>]*>([\s\S]*?)<div id=["']file["']/i);
  const detailHtml = detailMatch ? detailMatch[1] : "";
  for (const tabId of ["tabsdt1", "tabsdt2", "tabsdt3"]) {
    const match = detailHtml.match(new RegExp(`<div id=['"]${tabId}['"][^>]*>([\\s\\S]*?)<\\/div>`, "i"));
    tabs[tabId] = match ? match[1].trim() : "";
  }
  return tabs;
}

function extractImagesFromHtml(html) {
  return unique(
    [...html.matchAll(/<img\b[^>]*(?:src|data-src)=["']([^"']+)["'][^>]*>/gi)]
      .map((match) => removeQuery(absoluteUrl(match[1])))
  );
}

function extensionFor(url, contentType) {
  if (contentType.includes("webp")) return ".webp";
  if (contentType.includes("png")) return ".png";
  if (contentType.includes("gif")) return ".gif";
  const ext = path.extname(new URL(url).pathname.toLowerCase());
  if ([".jpg", ".jpeg", ".webp", ".png", ".gif"].includes(ext)) return ext === ".jpeg" ? ".jpg" : ext;
  return ".jpg";
}

function numberFromText(text) {
  const value = (text.match(/\d+/g) || []).join("");
  return value ? Number(value) : null;
}

function bytesToHuman(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (_error) {
    return false;
  }
}

async function directorySize(dir) {
  let total = 0;
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) total += await directorySize(entryPath);
      else if (entry.isFile()) total += (await fs.stat(entryPath)).size;
    }
  } catch (_error) {
    return 0;
  }
  return total;
}

async function listFiles(dir) {
  const files = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) files.push(...await listFiles(entryPath));
      else if (entry.isFile()) files.push(entryPath);
    }
  } catch (_error) {
    return files;
  }
  return files;
}

async function buildExistingImageIndex(report) {
  const byUrl = new Map();
  const byHash = new Map();
  for (const run of report.runs || []) {
    for (const product of run.products || []) {
      for (const image of product.images || []) {
        if (image.sourceUrl && image.localPath) byUrl.set(removeQuery(image.sourceUrl), image.localPath);
        if (image.sha256 && image.localPath) byHash.set(image.sha256, image.localPath);
      }
    }
  }

  const files = await listFiles(PUBLIC_PRODUCTS_DIR);
  for (const file of files) {
    const buffer = await fs.readFile(file);
    const hash = crypto.createHash("sha256").update(buffer).digest("hex");
    const localPath = `/${path.relative(path.join(ROOT_DIR, "public"), file).split(path.sep).join("/")}`;
    if (!byHash.has(hash)) byHash.set(hash, localPath);
  }
  return { byUrl, byHash };
}

async function findExistingImage(productDir, basename) {
  try {
    const entries = await fs.readdir(productDir);
    return entries.find((entry) => path.parse(entry).name === basename) || "";
  } catch (_error) {
    return "";
  }
}

async function downloadImage(url, productDir, publicDir, basename, options, imageIndex, runReport, reportEntry) {
  const cleanUrl = removeQuery(url);
  if (!cleanUrl) return "";

  if (imageIndex.byUrl.has(cleanUrl)) {
    const localPath = imageIndex.byUrl.get(cleanUrl);
    runReport.duplicateImageCount += 1;
    reportEntry.images.push({ sourceUrl: cleanUrl, localPath, status: "skipped-duplicate-url" });
    return localPath;
  }

  const existing = await findExistingImage(productDir, basename);
  if (existing && !options.force) {
    const localPath = `${publicDir}/${existing}`;
    imageIndex.byUrl.set(cleanUrl, localPath);
    reportEntry.images.push({ sourceUrl: cleanUrl, localPath, status: "skipped-existing-file" });
    return localPath;
  }

  try {
    const { buffer, contentType } = await fetchBuffer(cleanUrl);
    const sha256 = crypto.createHash("sha256").update(buffer).digest("hex");
    if (imageIndex.byHash.has(sha256)) {
      const localPath = imageIndex.byHash.get(sha256);
      imageIndex.byUrl.set(cleanUrl, localPath);
      runReport.duplicateImageCount += 1;
      reportEntry.images.push({ sourceUrl: cleanUrl, localPath, status: "skipped-duplicate-content", sha256 });
      return localPath;
    }

    const ext = extensionFor(cleanUrl, contentType);
    const filename = `${basename}${ext}`;
    const outputPath = path.join(productDir, filename);
    await fs.mkdir(productDir, { recursive: true });
    if (await pathExists(outputPath) && !options.force) {
      const localPath = `${publicDir}/${filename}`;
      imageIndex.byUrl.set(cleanUrl, localPath);
      imageIndex.byHash.set(sha256, localPath);
      reportEntry.images.push({ sourceUrl: cleanUrl, localPath, status: "skipped-existing-file", sha256 });
      return localPath;
    }

    await fs.writeFile(outputPath, buffer);
    const localPath = `${publicDir}/${filename}`;
    imageIndex.byUrl.set(cleanUrl, localPath);
    imageIndex.byHash.set(sha256, localPath);
    runReport.successImageCount += 1;
    runReport.newFileBytes += buffer.length;
    reportEntry.images.push({ sourceUrl: cleanUrl, localPath, status: "downloaded", bytes: buffer.length, sha256 });
    return localPath;
  } catch (error) {
    runReport.failedImageCount += 1;
    reportEntry.errors.push({ type: "image", sourceUrl: cleanUrl, error: error.message });
    return "";
  }
}

async function scrapeProduct(card, options, imageIndex, runReport) {
  const html = await fetchText(card.sourceUrl);
  const jsonLd = extractJsonLdProduct(html) || {};
  const breadcrumbs = extractBreadcrumb(html);
  const tabs = extractDetailTabs(html);
  const capturedAt = new Date().toISOString();
  const oldProductId = card.oldProductId;
  const productNo = extractMeta(html, "product:retailer_item_id") || extractMeta(html, "productID") || normalizeText(extractElementById(html, "ContentPlaceHolderContain_model")).replace(/^商品編號：/, "");
  const productName = normalizeText(extractElementById(html, "name")) || jsonLd.name || card.productName;
  const shortDescription = normalizeText(extractElementById(html, "ContentPlaceHolderContain_introduction")) || jsonLd.description || "";
  const listPriceText = normalizeText(extractElementById(html, "ContentPlaceHolderContain_origin"));
  const memberPriceText = normalizeText(extractElementById(html, "ContentPlaceHolderContain_onsale"));
  const listPrice = numberFromText(listPriceText) || card.listPrice || null;
  const memberPrice = numberFromText(memberPriceText) || Number(extractMeta(html, "product:price:amount")) || card.memberPrice || null;
  const shippingType = normalizeText(extractElementById(html, "shipment")).replace(/^運送方式：/, "");
  const mainImageRemote = removeQuery(absoluteUrl(extractMeta(html, "og:image") || jsonLd.image || card.listImageUrl));
  const thumbImages = extractImagesFromHtml(extractElementById(html, "ContentPlaceHolderContain_smallPhotoPanel"));
  const galleryRemoteImages = unique(thumbImages.filter((url) => url !== mainImageRemote)).slice(0, MAX_GALLERY_IMAGES);
  const productDir = path.join(PUBLIC_PRODUCTS_DIR, oldProductId);
  const publicDir = `/products/${oldProductId}`;
  const reportEntry = { oldProductId, sourceUrl: card.sourceUrl, images: [], errors: [] };

  const mainImageUrl = mainImageRemote
    ? await downloadImage(mainImageRemote, productDir, publicDir, "main", options, imageIndex, runReport, reportEntry)
    : "";

  const galleryImageUrls = [];
  for (let index = 0; index < galleryRemoteImages.length; index += 1) {
    const localPath = await downloadImage(galleryRemoteImages[index], productDir, publicDir, `gallery-${String(index + 1).padStart(2, "0")}`, options, imageIndex, runReport, reportEntry);
    if (localPath && localPath !== mainImageUrl && !galleryImageUrls.includes(localPath)) galleryImageUrls.push(localPath);
  }

  const detailCategoryName = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : "";
  const detailSubcategoryName = breadcrumbs.length ? breadcrumbs[breadcrumbs.length - 1] : "";
  const product = {
    oldProductId,
    productNo: productNo.trim(),
    productName,
    categoryName: card.categoryName || detailCategoryName,
    subcategoryName: card.subcategoryName || detailSubcategoryName,
    sourceCategories: [{
      categoryName: card.categoryName || detailCategoryName,
      subcategoryName: card.subcategoryName || detailSubcategoryName,
      sourceUrl: card.categoryUrl || "",
      cid: card.sourceCategoryId || extractCid(card.categoryUrl || ""),
    }],
    sourceCategoryNames: [card.categoryName || detailCategoryName].filter(Boolean),
    sourceSubcategoryNames: [card.subcategoryName || detailSubcategoryName].filter(Boolean),
    shortDescription,
    listPrice,
    memberPrice,
    mainImageUrl,
    galleryImageUrls,
    productDescription: stripImages(`${tabs.tabsdt1}\n${tabs.tabsdt2}`.trim()),
    specification: stripImages(tabs.tabsdt3.trim()),
    shippingType,
    sourceUrl: card.sourceUrl,
    capturedAt,
  };

  return { product, reportEntry };
}

async function readJsonIfExists(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (_error) {
    return fallback;
  }
}

function toCsvValue(value) {
  if (Array.isArray(value)) return `"${value.join("|").replace(/"/g, "\"\"")}"`;
  if (value === null || value === undefined) return "";
  return `"${String(value).replace(/"/g, "\"\"")}"`;
}

async function writeOutputs(products, report, failedProducts) {
  await fs.mkdir(path.dirname(PRODUCTS_JSON), { recursive: true });
  await fs.mkdir(EXPORT_DIR, { recursive: true });
  await fs.writeFile(PRODUCTS_JSON, `${JSON.stringify(products, null, 2)}\n`);
  const fields = [
    "oldProductId",
    "productNo",
    "productName",
    "categoryName",
    "subcategoryName",
    "shortDescription",
    "listPrice",
    "memberPrice",
    "mainImageUrl",
    "galleryImageUrls",
    "productDescription",
    "specification",
    "shippingType",
    "sourceUrl",
    "capturedAt",
  ];
  const csv = [fields.join(","), ...products.map((product) => fields.map((field) => toCsvValue(product[field])).join(","))].join("\n");
  await fs.writeFile(CSV_PATH, `${csv}\n`);
  await fs.writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  await fs.writeFile(FAILED_PRODUCTS_PATH, `${JSON.stringify(failedProducts, null, 2)}\n`);
}

function isActivityCategory(category) {
  const rootName = category.categoryName || "";
  const subName = category.subcategoryName || "";
  return [
    "點數換購",
    "限時",
    "地中海",
    "隔夜燕麥",
    "訂閱",
    "特惠",
    "任選",
    "買1送1",
    "多件組",
    "惜福",
    "盛夏",
    "中元",
    "健康伴手禮",
    "會員日",
    "推薦",
  ].some((keyword) => rootName.includes(keyword) || subName.includes(keyword));
}

function targetCategoryKey(category) {
  return normalizeCategoryKey(category.categoryName, category.subcategoryName || category.categoryName);
}

async function discoverCandidates(options, runReport, existingById) {
  console.log(`Reading home page: ${BASE_URL}/index.aspx`);
  const homeHtml = await fetchText(`${BASE_URL}/index.aspx`);
  let categories = extractCategoriesFromHome(homeHtml);
  if (options.category) categories = categories.filter((category) => category.id === options.category);
  if (!categories.length) throw new Error("No public categories were found on the home page");

  const candidates = [];
  const candidateIds = new Set(existingById ? existingById.keys() : []);
  const visitedCategoryPages = new Set();
  const targetCounts = new Map();
  const categoryTargets = new Map(categories.map((category) => [targetCategoryKey(category), category]));
  const queue = categories.map((category) => ({ ...category, pageUrl: category.url }));

  for (const product of existingById ? existingById.values() : []) {
    const refs = product.sourceCategories && product.sourceCategories.length
      ? product.sourceCategories
      : [{ categoryName: product.categoryName, subcategoryName: product.subcategoryName }];
    for (const ref of refs) {
      const key = normalizeCategoryKey(ref.categoryName, ref.subcategoryName || ref.categoryName);
      targetCounts.set(key, (targetCounts.get(key) || 0) + 1);
    }
  }

  while (queue.length && candidates.length < options.limit) {
    const page = queue.shift();
    if (visitedCategoryPages.has(page.pageUrl)) continue;
    visitedCategoryPages.add(page.pageUrl);

    try {
      console.log(`Reading category page: ${page.categoryName}${page.subcategoryName ? ` / ${page.subcategoryName}` : ""}`);
      const categoryHtml = await fetchText(page.pageUrl);
      const cards = extractProductCards(categoryHtml, page);
      const categoryKey = targetCategoryKey(page);
      for (const card of cards) {
        if (options.fillCategories && (targetCounts.get(categoryKey) || 0) >= options.minPerCategory) break;
        if (candidateIds.has(card.oldProductId)) {
          runReport.duplicateProductCount += 1;
          if (existingById && existingById.has(card.oldProductId)) {
            existingById.set(card.oldProductId, mergeCategoryRefs(existingById.get(card.oldProductId), card));
            targetCounts.set(categoryKey, (targetCounts.get(categoryKey) || 0) + 1);
          }
          continue;
        }
        candidateIds.add(card.oldProductId);
        candidates.push(card);
        targetCounts.set(categoryKey, (targetCounts.get(categoryKey) || 0) + 1);
        if (candidates.length >= options.limit) break;
      }

      const needsMoreForCategory = !options.fillCategories || (targetCounts.get(categoryKey) || 0) < options.minPerCategory;
      for (const pageUrl of needsMoreForCategory ? extractPaginationLinks(categoryHtml, page.pageUrl) : []) {
        if (!visitedCategoryPages.has(pageUrl)) queue.push({ ...page, pageUrl });
      }
    } catch (error) {
      runReport.categoryFailures.push({ sourceUrl: page.pageUrl, error: error.message });
      console.warn(`Category page failed: ${page.pageUrl} - ${error.message}`);
    }
  }

  const uncoveredCategories = Array.from(categoryTargets.keys())
    .filter((key) => (targetCounts.get(key) || 0) === 0)
    .map((key) => {
      const category = categoryTargets.get(key);
      return {
        categoryName: category.categoryName,
        subcategoryName: category.subcategoryName,
        sourceUrl: category.url,
      };
    });

  runReport.categoryCoverage = {
    minPerCategory: options.minPerCategory,
    targetCategoryCount: categoryTargets.size,
    coveredCategoryCount: Array.from(categoryTargets.keys()).filter((key) => (targetCounts.get(key) || 0) > 0).length,
    activityCategoryCount: categories.filter(isActivityCategory).length,
    uncoveredCategories,
    counts: Object.fromEntries(Array.from(targetCounts.entries()).sort((a, b) => a[0].localeCompare(b[0], "zh-Hant"))),
  };

  return candidates.slice(0, options.limit);
}

function summarizeManualReview(products) {
  return products
    .filter((product) => !product.mainImageUrl || !product.listPrice || !product.memberPrice)
    .map((product) => ({
      oldProductId: product.oldProductId,
      productName: product.productName,
      missing: [
        !product.mainImageUrl ? "mainImageUrl" : "",
        !product.listPrice ? "listPrice" : "",
        !product.memberPrice ? "memberPrice" : "",
      ].filter(Boolean),
    }));
}

function normalizeProductForOutput(product) {
  return {
    ...product,
    galleryImageUrls: (product.galleryImageUrls || []).slice(0, MAX_GALLERY_IMAGES),
    productDescription: stripImages(product.productDescription || ""),
    specification: stripImages(product.specification || ""),
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const startedAt = new Date().toISOString();
  const existingProducts = await readJsonIfExists(PRODUCTS_JSON, []);
  const existingById = new Map(existingProducts.map((product) => [product.oldProductId, product]));
  const previousReport = await readJsonIfExists(REPORT_PATH, { runs: [] });
  const startProductsSize = await directorySize(PUBLIC_PRODUCTS_DIR);

  const runReport = {
    startedAt,
    finishedAt: "",
    limit: options.limit,
    maxLimit: MAX_LIMIT,
    fillCategories: options.fillCategories,
    minPerCategory: options.minPerCategory,
    resume: options.resume,
    force: options.force,
    plannedProductCount: 0,
    plannedMaxImageCount: 0,
    successCount: 0,
    failureCount: 0,
    skippedExistingCount: 0,
    duplicateProductCount: 0,
    duplicateImageCount: 0,
    successImageCount: 0,
    failedImageCount: 0,
    newFileBytes: 0,
    newFileSize: "",
    productsFolderBytesBefore: startProductsSize,
    productsFolderBytesAfter: 0,
    productsFolderSizeBefore: bytesToHuman(startProductsSize),
    productsFolderSizeAfter: "",
    imageStoragePath: path.relative(ROOT_DIR, PUBLIC_PRODUCTS_DIR),
    categoryFailures: [],
    products: [],
    failures: [],
    missingMainImageOrPrice: [],
    manualReview: [],
    categoryCoverage: null,
  };

  const candidates = await discoverCandidates(options, runReport, existingById);
  runReport.plannedProductCount = candidates.length;
  runReport.plannedMaxImageCount = candidates.length * (1 + MAX_GALLERY_IMAGES);

  console.log(JSON.stringify({
    plannedProductCount: runReport.plannedProductCount,
    plannedMaxImageCount: runReport.plannedMaxImageCount,
    imageStoragePath: runReport.imageStoragePath,
    currentProductsFolderSize: runReport.productsFolderSizeBefore,
  }, null, 2));

  const imageIndex = await buildExistingImageIndex(previousReport);
  const scrapedProducts = [];
  const failedProducts = [];

  for (const candidate of candidates) {
    if (existingById.has(candidate.oldProductId) && !options.force) {
      scrapedProducts.push(mergeCategoryRefs(existingById.get(candidate.oldProductId), candidate));
      runReport.skippedExistingCount += 1;
      runReport.products.push({
        oldProductId: candidate.oldProductId,
        sourceUrl: candidate.sourceUrl,
        status: "skipped-existing-product",
      });
      continue;
    }

    try {
      console.log(`Reading product: ${candidate.oldProductId} ${candidate.productName}`);
      const { product, reportEntry } = await scrapeProduct(candidate, options, imageIndex, runReport);
      scrapedProducts.push(product);
      runReport.successCount += 1;
      runReport.products.push({ ...reportEntry, status: "success" });
    } catch (error) {
      const failure = {
        oldProductId: candidate.oldProductId,
        productName: candidate.productName,
        sourceUrl: candidate.sourceUrl,
        error: error.message,
      };
      runReport.failureCount += 1;
      runReport.failures.push(failure);
      failedProducts.push(failure);
      console.warn(`Product failed: ${candidate.sourceUrl} - ${error.message}`);
    }
  }

  const merged = new Map(Array.from(existingById.entries()));
  for (const product of scrapedProducts) merged.set(product.oldProductId, product);
  const outputProducts = Array.from(merged.values()).slice(0, options.limit).map(normalizeProductForOutput);
  const endProductsSize = await directorySize(PUBLIC_PRODUCTS_DIR);

  runReport.finishedAt = new Date().toISOString();
  runReport.productsFolderBytesAfter = endProductsSize;
  runReport.productsFolderSizeAfter = bytesToHuman(endProductsSize);
  runReport.newFileBytes = Math.max(runReport.newFileBytes, endProductsSize - startProductsSize);
  runReport.newFileSize = bytesToHuman(runReport.newFileBytes);
  runReport.missingMainImageOrPrice = summarizeManualReview(outputProducts);
  runReport.manualReview = [
    ...runReport.missingMainImageOrPrice.map((item) => ({
      ...item,
      reason: `Missing ${item.missing.join(", ")}`,
    })),
    ...runReport.categoryFailures.map((item) => ({ ...item, reason: "Category page failed during discovery" })),
  ];

  previousReport.runs = [...(previousReport.runs || []), runReport];
  await writeOutputs(outputProducts, previousReport, failedProducts);

  console.log(JSON.stringify({
    successProductCount: runReport.successCount,
    failureProductCount: runReport.failureCount,
    skippedProductCount: runReport.skippedExistingCount,
    duplicateProductCount: runReport.duplicateProductCount,
    successImageCount: runReport.successImageCount,
    failedImageCount: runReport.failedImageCount,
    newFileSize: runReport.newFileSize,
    productsFolderSize: runReport.productsFolderSizeAfter,
    missingMainImageOrPriceCount: runReport.missingMainImageOrPrice.length,
    manualReviewCount: runReport.manualReview.length,
    productsJson: path.relative(ROOT_DIR, PRODUCTS_JSON),
    productsCsv: path.relative(ROOT_DIR, CSV_PATH),
    report: path.relative(ROOT_DIR, REPORT_PATH),
    failedProducts: path.relative(ROOT_DIR, FAILED_PRODUCTS_PATH),
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
