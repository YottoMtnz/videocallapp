# VideoChat Pro

## Subir a GitHub
1. Crea un repositorio nuevo y sube TODO el contenido de esta carpeta (incluida `.github`).
2. En el repo: **Settings → Pages → Source: GitHub Actions**.
3. En **Actions** se ejecuta "Publicar web". Al terminar, el enlace queda en `https://TU_USUARIO.github.io/NOMBRE_REPO/`. Ese es el link para compartir (HTTPS, necesario para la cámara).

## APK de Android
En **Actions → Compilar APK → Run workflow** (también se lanza solo con cada push). Al acabar (~5 min), descarga el artefacto **VideoChatPro-apk** (zip con `app-debug.apk`). Instálalo en el móvil permitiendo "orígenes desconocidos".

## Cambiar los vídeos
Reemplaza `www/videos/v1.mp4 … v4.mp4` (mantén los nombres) y vuelve a subir.

Todo funciona en el dispositivo: contactos y ajustes se guardan en el propio navegador/app; la cámara solo se muestra en pantalla y nada se envía a ningún servidor.
