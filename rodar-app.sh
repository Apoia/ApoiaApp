#!/bin/bash

echo "🚀 Iniciando ApoiaApp..."
echo ""

# Parar processos antigos
echo "📦 Parando processos antigos..."
pkill -9 -f "expo\|metro" 2>/dev/null
sleep 2

# Limpar cache
echo "🧹 Limpando cache..."
rm -rf .expo node_modules/.cache .metro 2>/dev/null

# Configurar reverse proxy para Android
echo "🔌 Configurando reverse proxy para Android..."
adb reverse tcp:8081 tcp:8081 2>/dev/null || echo "⚠️  Dispositivo não conectado via USB"

# Verificar se API está rodando
echo "🌐 Verificando API..."
API_STATUS=$(curl -s http://192.168.1.25:8001/api/test 2>/dev/null | grep -o "success" || echo "")
if [ -z "$API_STATUS" ]; then
    echo "⚠️  API não está respondendo em http://192.168.1.25:8001"
    echo "   Inicie a API com: cd ../ApoiaApp-API && php artisan serve --host=0.0.0.0 --port=8001"
else
    echo "✅ API está rodando"
fi

echo ""
echo "🎯 Iniciando Expo..."
echo "   - Pressione 'a' para abrir no Android"
echo "   - Pressione 'r' para recarregar"
echo "   - Pressione 'j' para abrir debugger"
echo ""

# Iniciar Expo
npx expo start --clear


