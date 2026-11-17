
# Prueba de autenticacion de ServiciosNerea
# Login -> Sesion -> Logout -> Sesion cerrada

$baseUrl = "http://localhost:3000"
$email = Read-Host "Email de prueba"
$segura = Read-Host "Contrasena" -AsSecureString

$credencial = [System.Net.NetworkCredential]::new("", $segura)

$datos = @{
    email = $email
    password = $credencial.Password
} | ConvertTo-Json -Compress

$archivo = Join-Path $env:TEMP "sn-auth-body.json"
$cookieJar = Join-Path $env:TEMP "sn-auth-cookies.txt"

try {
    [System.IO.File]::WriteAllText(
        $archivo,
        $datos,
        [System.Text.UTF8Encoding]::new($false)
    )

    Remove-Item $cookieJar -ErrorAction SilentlyContinue

    Write-Host "`n1. LOGIN"

    $login = curl.exe --http1.1 -sS `
        -o NUL `
        -w "%{http_code}" `
        -c $cookieJar `
        -H "Content-Type: application/json" `
        -H "Origin: $baseUrl" `
        -H "Expect:" `
        --data-binary "@$archivo" `
        "$baseUrl/api/auth/login"

    Write-Host "HTTP login: $login"

    if ($login -ne "200") {
        Write-Host "Login fallido. Se detiene la prueba."
        return
    }

    Write-Host "`n2. SESION ACTIVA"

    $sesion = curl.exe --http1.1 -sS `
        -o NUL `
        -w "%{http_code}" `
        -b $cookieJar `
        "$baseUrl/api/auth/me"

    Write-Host "HTTP sesion: $sesion"

Write-Host "`n2B. CINCO SOLICITUDES SIMULTANEAS"

$trabajos = @(
    1..5 | ForEach-Object {
        Start-Job -ArgumentList $baseUrl, $cookieJar -ScriptBlock {
            param($url, $cookies)

            curl.exe --http1.1 -sS `
                -o NUL `
                -w "%{http_code}" `
                -b $cookies `
                "$url/api/auth/me"
        }
    }
)

$resultados = @(
    $trabajos | Wait-Job | Receive-Job
)

$trabajos | Remove-Job

Write-Host "HTTP simultaneos: $($resultados -join ', ')"

Write-Host "`n2C. RENOVACIONES SIMULTANEAS"

$cookieJarRefresh = Join-Path $env:TEMP "sn-auth-refresh-only.txt"

# Crear una copia de las cookies sin el access token
Get-Content $cookieJar |
    Where-Object { $_ -notmatch 'sn_access' } |
    Set-Content $cookieJarRefresh

$trabajosRefresh = @(
    1..5 | ForEach-Object {
        Start-Job -ArgumentList $baseUrl, $cookieJarRefresh -ScriptBlock {
            param($url, $cookies)

            curl.exe --http1.1 -sS `
                -o NUL `
                -w "%{http_code}" `
                -b $cookies `
                "$url/api/auth/me"
        }
    }
)

$resultadosRefresh = @(
    $trabajosRefresh | Wait-Job | Receive-Job
)

$trabajosRefresh | Remove-Job

Write-Host "HTTP renovaciones: $($resultadosRefresh -join ', ')"

Remove-Item $cookieJarRefresh -ErrorAction SilentlyContinue

    Write-Host "`n3. CERRAR SESION"

    $logout = curl.exe --http1.1 -sS `
        -o NUL `
        -w "%{http_code}" `
        -X POST `
        -b $cookieJar `
        -c $cookieJar `
        -H "Origin: $baseUrl" `
        "$baseUrl/api/auth/logout"

    Write-Host "HTTP logout: $logout"

    Write-Host "`n4. SESION DESPUES DEL LOGOUT"

    $sesionFinal = curl.exe --http1.1 -sS `
        -o NUL `
        -w "%{http_code}" `
        -b $cookieJar `
        "$baseUrl/api/auth/me"

    Write-Host "HTTP sesion final: $sesionFinal"

    Write-Host "`nRESULTADO GENERAL"

    if (
        $login -eq "200" -and
        $sesion -eq "200" -and
        $logout -eq "200" -and
        $sesionFinal -eq "401"
    ) {
        Write-Host "PRUEBA COMPLETA: OK"
    } else {
        Write-Host "PRUEBA INCOMPLETA: revisar resultados."
    }
}
finally {
    Remove-Item $archivo, $cookieJar -ErrorAction SilentlyContinue
    Remove-Variable datos, credencial, segura -ErrorAction SilentlyContinue
}
