# コードスタイルと規約

## TypeScript/React規約

### TypeScript設定
- **Target**: ES2020
- **Strict Mode**: 有効
- **未使用変数/パラメータ**: エラー
- **JSX**: react-jsx

### 命名規則
- **コンポーネント**: PascalCase（例: `CreateGreeting.tsx`）
- **関数/変数**: camelCase
- **定数**: UPPER_SNAKE_CASE（constants.tsで定義）
- **型/インターフェース**: PascalCase

### ファイル構造
- コンポーネントは個別のファイルに分離
- 共通の定数は`constants.ts`に集約
- ネットワーク設定は`networkConfig.ts`に集約

### Prettier設定
- `proseWrap: "always"` - マークダウンの自動折り返し

### ESLint設定
- TypeScript ESLintプラグイン使用
- React Hooksルール適用
- React Refreshプラグイン使用
- 最大警告数: 0（警告もエラーとして扱う）

## Move言語規約

### パッケージ構造
- Edition: 2024.beta
- Sui Frameworkへの依存: testnetブランチ使用

### ファイル命名
- snake_case（例: `greeting.move`）

## Git規約

### コミットメッセージ形式（コンベンショナルコミット）
```
<type>: <description>

[optional body]

[optional footer]
```

### Type一覧
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント変更
- `test`: テスト追加・修正
- `refactor`: リファクタリング
- `chore`: その他の変更

### コミットの原則
- 原子的なコミット（1つの変更に焦点）
- 英語で記述
- main/masterブランチへの直接コミットは避ける

## スタイリング規約

### Tailwind CSS
- ファイター向けテーマ（大胆でエネルギッシュな色使い）
- モバイルファースト設計

### Radix UI
- カラーシステム: @radix-ui/colors
- アイコン: @radix-ui/react-icons
- テーマ: @radix-ui/themes

## コード品質の原則

### DRY原則
- 重複を避け、単一の信頼できる情報源を維持

### 命名
- 意味のある変数名・関数名で意図を明確に伝える

### コメント
- 「なぜ」を説明し、「何を」はコードで表現

### 一貫性
- プロジェクト全体で一貫したコーディングスタイルを維持
