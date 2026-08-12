# increment-version.ps1
$filePath = ".\js\version.js"

# Проверяем существование файла
if (!(Test-Path $filePath)) {
    # Создаем папку js если её нет
    $jsDir = ".\js"
    if (!(Test-Path $jsDir)) {
        New-Item -ItemType Directory -Path $jsDir -Force
    }
    # Создаем файл с начальной версией
    "const SITE_VERSION = '0.0.1';" | Out-File -FilePath $filePath -Encoding utf8
    Write-Host "Created version.js with version 0.0.1"
    exit 0
}

# Читаем файл
$content = Get-Content $filePath -Raw -Encoding UTF8

# Находим версию
$pattern = 'const SITE_VERSION\s*=\s*[''"]([^''"]+)[''"]'
$match = [regex]::Match($content, $pattern)

if (!$match.Success) {
    Write-Host "ERROR: Version not found in file"
    exit 1
}

$currentVersion = $match.Groups[1].Value
$parts = $currentVersion.Split('.')
$lastPart = [int]$parts[-1] + 1
$parts[-1] = $lastPart.ToString()
$newVersion = $parts -join '.'

# Заменяем версию
$newContent = $content -replace $pattern, "const SITE_VERSION = '$newVersion'"
$newContent | Out-File -FilePath $filePath -Encoding utf8

Write-Host "Version updated: $currentVersion -> $newVersion"