$filePath = "src\app\weddings\[id]\page.tsx"
$content = Get-Content -LiteralPath $filePath
$content = $content -replace 'import WeddingAbout from "@/components/WeddingAbout";', 'import WhyJadeWeddings from "@/components/WhyJadeWeddings";'
$content = $content -replace 'import Image from "next/image";', 'import Image from "next/image";`r`nimport FloatingBottomAction from "@/components/FloatingBottomAction";'
Set-Content -LiteralPath $filePath -Value $content
