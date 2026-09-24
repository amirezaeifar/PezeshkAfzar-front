$ErrorActionPreference = 'Stop'
$sourceDirectory = Join-Path (Get-Location) 'tmp/home-clinical-sources'
New-Item -ItemType Directory -Path $sourceDirectory -Force | Out-Null

$photos = @(
  @{ Id = '1430845'; Owner = 'rawpixel.com' },
  @{ Id = '1446883'; Owner = 'rawpixel.com' },
  @{ Id = '1571895'; Owner = 'rawpixel.com' },
  @{ Id = '1444737'; Owner = 'rawpixel.com' },
  @{ Id = '1605139'; Owner = 'secildegirmenciler' },
  @{ Id = '1659676'; Owner = 'MedPoint24' },
  @{ Id = '1682242'; Owner = 'cooper1629' },
  @{ Id = '1700518'; Owner = 'gebakax' },
  @{ Id = '1708392'; Owner = 'mihewo4724' },
  @{ Id = '1708394'; Owner = 'mihewo4724' },
  @{ Id = '1708382'; Owner = 'mihewo4724' },
  @{ Id = '1708594'; Owner = 'SnapNest03' },
  @{ Id = '1708612'; Owner = 'SnapNest03' },
  @{ Id = '1708614'; Owner = 'SnapNest03' },
  @{ Id = '1719488'; Owner = 'mihewo4724' },
  @{ Id = '1719492'; Owner = 'mihewo4724' },
  @{ Id = '1727378'; Owner = 'mihewo4724' }
)

foreach ($photo in $photos) {
  $pageUrl = "https://pxhere.com/en/photo/$($photo.Id)"
  $response = $null
  for ($attempt = 1; $attempt -le 4; $attempt++) {
    try {
      $response = Invoke-WebRequest -Uri $pageUrl -UseBasicParsing
      break
    } catch {
      if ($attempt -eq 4) { throw }
      Start-Sleep -Seconds $attempt
    }
  }
  $imageMatch = [regex]::Match($response.Content, 'https://c\.pxhere\.com/[^\"'']+?\.jpg!d')
  if (-not $imageMatch.Success) { throw "No source image found for PxHere $($photo.Id)" }
  $destination = Join-Path $sourceDirectory "$($photo.Id)-$($photo.Owner).jpg"
  for ($attempt = 1; $attempt -le 4; $attempt++) {
    try {
      Invoke-WebRequest -Uri $imageMatch.Value -OutFile $destination -UseBasicParsing
      break
    } catch {
      if ($attempt -eq 4) { throw }
      Start-Sleep -Seconds $attempt
    }
  }
  Write-Output "$($photo.Id) $($photo.Owner) $($imageMatch.Value)"
}
