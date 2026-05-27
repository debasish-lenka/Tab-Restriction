param(
    [Parameter(Mandatory = $true)]
    [string]$ChromeExtensionId,

    [Parameter(Mandatory = $true)]
    [string]$EdgeExtensionId
)

$chromeUpdateUrl = "https://clients2.google.com/service/update2/crx"
$edgeUpdateUrl = "https://edge.microsoft.com/extensionwebstorebase/v1/crx"

$chromeBase = "HKLM:\SOFTWARE\Policies\Google\Chrome"
$edgeBase = "HKLM:\SOFTWARE\Policies\Microsoft\Edge"

function Ensure-Key {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    if (-not (Test-Path -LiteralPath $Path)) {
        New-Item -Path $Path -Force | Out-Null
    }
}

function Set-PolicyString {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,
        [Parameter(Mandatory = $true)]
        [string]$Name,
        [Parameter(Mandatory = $true)]
        [string]$Value
    )

    Ensure-Key -Path $Path
    New-ItemProperty -Path $Path -Name $Name -PropertyType String -Value $Value -Force | Out-Null
}

$chromeForceList = Join-Path $chromeBase "ExtensionInstallForcelist"
$chromeSettings = Join-Path $chromeBase "ExtensionSettings"
$edgeForceList = Join-Path $edgeBase "ExtensionInstallForcelist"
$edgeSettings = Join-Path $edgeBase "ExtensionSettings"

Set-PolicyString -Path $chromeForceList -Name "1" -Value "$ChromeExtensionId;$chromeUpdateUrl"
Set-PolicyString -Path $chromeSettings -Name $ChromeExtensionId -Value "{`"installation_mode`":`"force_installed`",`"update_url`":`"$chromeUpdateUrl`",`"toolbar_state`":`"force_shown`"}"

Set-PolicyString -Path $edgeForceList -Name "1" -Value "$EdgeExtensionId;$edgeUpdateUrl"
Set-PolicyString -Path $edgeSettings -Name $EdgeExtensionId -Value "{`"installation_mode`":`"force_installed`",`"update_url`":`"$edgeUpdateUrl`",`"toolbar_state`":`"force_shown`"}"

Write-Output "Managed extension policies were written for Chrome and Edge."
