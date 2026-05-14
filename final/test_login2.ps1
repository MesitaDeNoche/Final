$usernames = @("admin", "administrador", "marAzul", "marazul", "superadmin", "root", "manager", "empleado", "staff")
$passwords = @("admin1234", "admin123", "Admin123", "password", "123456", "admin", "12345678")
foreach ($u in $usernames) {
    foreach ($p in $passwords) {
        $body = [System.Text.Encoding]::UTF8.GetBytes('{"username":"' + $u + '","password":"' + $p + '"}')
        $req = [System.Net.WebRequest]::Create("http://localhost:8070/api/auth/login")
        $req.Method = "POST"
        $req.ContentType = "application/json"
        $req.ContentLength = $body.Length
        $s = $req.GetRequestStream()
        $s.Write($body, 0, $body.Length)
        $s.Close()
        try {
            $resp = $req.GetResponse()
            $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
            Write-Host "SUCCESS $u/$p -> " $reader.ReadToEnd()
        } catch [System.Net.WebException] {
            $errReader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $errMsg = $errReader.ReadToEnd()
            if ($errMsg -notlike '*incorrecta*' -and $errMsg -notlike '*registrado*') {
                Write-Host "INTERESTING $u/$p -> $errMsg"
            }
        }
    }
}
