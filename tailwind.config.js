/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary:   '#78B43F', // 統一生機綠
          secondary: '#4A7C2C',
          accent:    '#FF7E36', // 點綴橘
          dark:      '#1F2937', // 加深灰度 (Gray 800) 確保高對比度
          bg:        '#FFFFFF',
          surface:   '#F9FAFB',
        },
      },
      fontSize: {
        'xs':   ['0.875rem', { lineHeight: '1.25rem' }], // 14px (最小規格、補充資訊)
        'sm':   ['1rem',     { lineHeight: '1.5rem' }],  // 16px (基礎內文、主按鈕)
        'base': ['1.125rem', { lineHeight: '1.75rem' }], // 18px (強化標題、商品名)
        'lg':   ['1.25rem',  { lineHeight: '1.75rem' }], // 20px (區塊標題)
        'xl':   ['1.5rem',   { lineHeight: '2rem' }],    // 24px (頁面標題)
        '2xl':  ['1.875rem', { lineHeight: '2.25rem' }], // 30px (Hero 大標)
      },
      borderRadius: {
        'none': '0',
        'sm':   '4px',
        'md':   '8px', // 全站統一圓角
        'lg':   '12px',
        'xl':   '16px',
        '2xl':  '24px',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
