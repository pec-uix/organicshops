<template>
  <transition name="modal-fade">
    <div
      v-if="report"
      class="fixed inset-0 z-50 flex items-center justify-center p-2 lg:p-4"
      role="dialog"
      aria-modal="true"
      @click.self="$emit('close')"
    >
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>

      <div class="relative z-10 w-full max-w-[96vw] lg:max-w-[92vw] h-[92vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden bg-gray-900">

        <!-- 頂部工具列 -->
        <div class="flex items-center px-5 py-3 bg-gray-900 border-b border-white/10 flex-shrink-0">
          <!-- 縮放 -->
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white text-base leading-none transition-colors hover:bg-white/20"
              title="縮小"
              @click="zoomOut"
            >−</button>
            <span class="text-xs text-white/60 font-mono w-10 text-center">{{ zoomLabel }}</span>
            <button
              type="button"
              class="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white text-base leading-none transition-colors hover:bg-white/20"
              title="放大"
              @click="zoomIn"
            >+</button>
          </div>
          <!-- 關閉靠右 -->
          <div class="ml-auto">
            <button
              type="button"
              class="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              @click="$emit('close')"
            >
              關閉
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- PDF Canvas 區 -->
        <div ref="scrollArea" class="flex-1 overflow-auto bg-gray-700 flex justify-center py-5 px-4">
          <div v-if="loading" class="flex flex-col items-center justify-center h-full gap-3 text-white/50">
            <svg class="h-10 w-10 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span class="text-sm font-medium">載入中…</span>
          </div>
          <div v-else-if="error" class="flex flex-col items-center justify-center h-full gap-3 text-white/50">
            <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-sm font-medium">{{ error }}</span>
          </div>
          <canvas v-show="!loading && !error" ref="canvas" class="shadow-2xl max-w-full"></canvas>
        </div>

        <!-- 底部翻頁列 -->
        <div class="flex items-center justify-center gap-4 bg-gray-900 border-t border-white/10 py-3 flex-shrink-0">
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-white/20"
            :disabled="currentPage <= 1"
            :class="{ 'opacity-30 cursor-not-allowed': currentPage <= 1 }"
            @click="prevPage"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
            上一頁
          </button>
          <span class="text-xs text-white/50 font-mono tabular-nums">{{ currentPage }} / {{ totalPages }}</span>
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-white/20"
            :disabled="currentPage >= totalPages"
            :class="{ 'opacity-30 cursor-not-allowed': currentPage >= totalPages }"
            @click="nextPage"
          >
            下一頁
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import { InspectionReport } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pdfjsLib = (window as any).pdfjsLib
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

const SCALES = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0]

export default Vue.extend({
  name: 'InspectionPdfModal',
  props: {
    report: { type: Object as () => InspectionReport | null, default: null },
  },
  data() {
    return {
      pdfDoc: null as any,
      currentPage: 1,
      totalPages: 0,
      scaleIndex: 2, // 預設 1.0
      loading: false,
      error: '',
      renderTask: null as any,
    }
  },
  computed: {
    scale(): number {
      return SCALES[this.scaleIndex]
    },
    zoomLabel(): string {
      return Math.round(this.scale * 100) + '%'
    },
  },
  watch: {
    report(newVal) {
      if (newVal) {
        this.loadPdf(newVal.pdfUrl)
      } else {
        this.reset()
      }
    },
    currentPage() {
      this.renderPage(this.currentPage)
    },
    scale() {
      this.renderPage(this.currentPage)
    },
  },
  mounted() {
    window.addEventListener('keydown', this.onKeydown)
    if (this.report) this.loadPdf(this.report.pdfUrl)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeydown)
    this.reset()
  },
  methods: {
    async loadPdf(url: string) {
      this.loading = true
      this.error = ''
      this.currentPage = 1
      this.totalPages = 0
      if (this.pdfDoc) { this.pdfDoc.destroy(); this.pdfDoc = null }

      try {
        const loadingTask = pdfjsLib.getDocument(url)
        this.pdfDoc = await loadingTask.promise
        this.totalPages = this.pdfDoc.numPages
        this.loading = false
        await this.renderPage(1)
      } catch (e) {
        this.loading = false
        this.error = 'PDF 載入失敗，請確認檔案路徑。'
      }
    },
    async renderPage(pageNum: number) {
      if (!this.pdfDoc) return
      if (this.renderTask) { this.renderTask.cancel(); this.renderTask = null }

      const page = await this.pdfDoc.getPage(pageNum)
      const viewport = page.getViewport({ scale: this.scale })
      const canvas = this.$refs.canvas as HTMLCanvasElement
      const ctx = canvas.getContext('2d')!
      canvas.width = viewport.width
      canvas.height = viewport.height

      const renderContext = { canvasContext: ctx, viewport }
      this.renderTask = page.render(renderContext)
      try {
        await this.renderTask.promise
      } catch {
        // cancelled
      }
      this.renderTask = null

      const scrollArea = this.$refs.scrollArea as HTMLElement
      if (scrollArea) scrollArea.scrollTop = 0
    },
    prevPage() { if (this.currentPage > 1) this.currentPage-- },
    nextPage() { if (this.currentPage < this.totalPages) this.currentPage++ },
    zoomIn() { if (this.scaleIndex < SCALES.length - 1) this.scaleIndex++ },
    zoomOut() { if (this.scaleIndex > 0) this.scaleIndex-- },
    reset() {
      if (this.pdfDoc) { this.pdfDoc.destroy(); this.pdfDoc = null }
      this.currentPage = 1
      this.totalPages = 0
      this.scaleIndex = 2
      this.error = ''
    },
    onKeydown(e: KeyboardEvent) {
      if (!this.report) return
      if (e.key === 'Escape') this.$emit('close')
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') this.nextPage()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') this.prevPage()
    },
  },
})
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter, .modal-fade-leave-to { opacity: 0; }
</style>
