$passwords = @("admin", "admin123", "Admin123", "password", "123456", "admin1234", "Admin1234!", "marAzul", "MarAzul123", "12345678", "adminadmin", "admin2024", "admin2025", "admin2026", "final", "Final123", "cabana", "Cabana123")
foreach ($p in $passwords) {
    $body = [System.Text.Encoding]::UTF8.GetBytes('{"username":"admin","password":"' + $p + '"}')
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
        Write-Host "SUCCESS $p -> " $reader.ReadToEnd()
    } catch [System.Net.WebException] {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "FAIL $p -> " $reader.ReadToEnd()
    }
}
