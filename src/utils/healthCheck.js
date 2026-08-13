const healthCheckHTML = `<!DOCTYPE html>

<html lang="es">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Health Check - ShipNow API</title>
<script src="https://cdn.tailwindcss.com"></script>
<style>
        body {
            background-color: #f9fafb;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
        }
    </style>
</head>
<body class="flex items-center justify-center min-h-screen bg-gray-50">
<div class="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
<div class="flex items-center justify-center mb-4">
<div class="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
<span class="text-gray-500 font-medium uppercase tracking-wider text-xs">Status: Online</span>
</div>
<h1 class="text-2xl font-bold text-gray-900 mb-2">ShipNow API v1 - corriendo</h1>
<p class="text-gray-500 text-sm">El sistema está funcionando correctamente.</p>
</div>
</body>
</html>`;

module.exports = healthCheckHTML;
