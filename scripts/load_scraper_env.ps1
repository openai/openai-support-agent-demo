$ProjectRoot = (Join-Path $PSScriptRoot '..')
$EnvFile = $env:SCRAPER_ENV_FILE
if (-not $EnvFile) {
    $EnvFile = Join-Path $ProjectRoot '.env.scrapers'
}

if (-not (Test-Path -LiteralPath $EnvFile)) {
    return
}

Get-Content -LiteralPath $EnvFile | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith('#')) {
        return
    }
    $parts = $line -split '=', 2
    if ($parts.Length -ne 2) {
        return
    }
    $name = $parts[0].Trim()
    $value = $parts[1]
    if (-not $name) {
        return
    }
    Set-Item -Path Env:$name -Value $value
}
