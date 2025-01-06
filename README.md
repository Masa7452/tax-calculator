# 確定申告計算ツール

所得税計算ツールです。青色申告・白色申告に対応し、給与所得がある場合の所得税額も含めて計算できます。

## 機能

- 事業所得（副業・フリーランス収入）の計算
  - 収入と経費から所得金額を自動計算
  - 青色申告（65万円/10万円）と白色申告に対応
- 給与所得との合算対応
  - 源泉徴収票の情報を利用
  - 給与所得控除後の金額を使用
- 所得控除の一括入力
  - すべての所得控除（基礎控除、社会保険料控除など）の合計額を入力
- 税額の自動計算
  - 所得税率（5%～45%）を自動判定
  - 復興特別所得税（2.1%）を含む
  - 源泉徴収税額との差額を計算

## 技術スタック

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Vercel (デプロイ)

## インストール方法

```bash
# リポジトリのクローン
git clone https://github.com/your-username/tax-calculator.git
cd tax-calculator

# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

## 必要なコンポーネントのインストール

```bash
# shadcn/uiの初期設定
npx shadcn-ui@latest init

# 使用するコンポーネントのインストール
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add accordion
npx shadcn-ui@latest add tooltip
```

## 使用方法

1. 副業・フリーランス収入の情報を入力
   - 総収入金額
   - 必要経費合計
   - 申告方式（青色/白色）の選択

2. 給与所得の情報を入力（該当する場合）
   - 給与所得控除後の金額（源泉徴収票から）
   - 源泉徴収された所得税額

3. 所得控除の情報を入力
   - すべての所得控除の合計額を入力

4. 計算結果の確認
   - 総所得金額
   - 課税所得金額
   - 所得税額
   - 復興特別所得税
   - 確定申告による納付税額

## 注意事項

- このツールは一般的な所得税額の計算を行うための参考ツールです
- 実際の確定申告では、税理士に相談するか、国税庁のウェブサイトで確認することをお勧めします
- 特殊な所得や控除がある場合は、このツールでは正確な計算ができない可能性があります
- 税制改正があった場合は、計算方法が変更になる可能性があります

## 開発者向け情報

### 環境構築

```bash
# Next.jsプロジェクトの作成
npx create-next-app@latest tax-calculator --typescript --tailwind --eslint

# 必要なパッケージのインストール
npm install lucide-react
```

### ファイル構造

```
tax-calculator/
├── app/
│   ├── components/
│   │   └── tax-calculator.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── components.json
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```
