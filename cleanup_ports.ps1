$ports = @(5173, 5174)
foreach ($port in $ports) {
    Write-Host "Checking port $port..."
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        Write-Host "Found process on port $port"
        foreach ($conn in $connections) {
            $pid_to_kill = $conn.OwningProcess
            Write-Host "Killing PID $pid_to_kill"
            try {
                Stop-Process -Id $pid_to_kill -Force -ErrorAction Stop
                Write-Host "Successfully killed PID $pid_to_kill"
            }
            catch {
                Write-Host "Failed to kill PID $pid_to_kill : $_"
            }
        }
    }
    else {
        Write-Host "No process found on port $port"
    }
}
Write-Host "Cleanup complete."
