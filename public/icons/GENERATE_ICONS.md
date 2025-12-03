# Instructions pour générer les icônes PWA

Pour générer les icônes PNG aux différentes tailles, vous pouvez utiliser :

## Option 1 : En ligne (rapide)

1. Visitez https://realfavicongenerator.net/
2. Uploadez le fichier `icon-512x512.svg`
3. Téléchargez le package d'icônes
4. Placez les fichiers dans `/public/icons/`

## Option 2 : Avec ImageMagick (local)

```bash
# Installer ImageMagick
brew install imagemagick  # macOS
# ou
sudo apt-get install imagemagick  # Linux

# Générer les icônes
cd public/icons
magick icon-512x512.svg -resize 72x72 icon-72x72.png
magick icon-512x512.svg -resize 96x96 icon-96x96.png
magick icon-512x512.svg -resize 128x128 icon-128x128.png
magick icon-512x512.svg -resize 144x144 icon-144x144.png
magick icon-512x512.svg -resize 152x152 icon-152x152.png
magick icon-512x512.svg -resize 192x192 icon-192x192.png
magick icon-512x512.svg -resize 384x384 icon-384x384.png
magick icon-512x512.svg -resize 512x512 icon-512x512.png
```

## Option 3 : Avec Sharp (Node.js)

```bash
npm install -g sharp-cli
sharp -i icon-512x512.svg -o icon-72x72.png resize 72 72
sharp -i icon-512x512.svg -o icon-96x96.png resize 96 96
sharp -i icon-512x512.svg -o icon-128x128.png resize 128 128
sharp -i icon-512x512.svg -o icon-144x144.png resize 144 144
sharp -i icon-512x512.svg -o icon-152x152.png resize 152 152
sharp -i icon-512x512.svg -o icon-192x192.png resize 192 192
sharp -i icon-512x512.svg -o icon-384x384.png resize 384 384
sharp -i icon-512x512.svg -o icon-512x512.png resize 512 512
```

## Fichiers requis

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png (minimum pour Android)
- icon-384x384.png
- icon-512x512.png (recommandé pour splash screen)

## Badge pour notifications (optionnel)

Créez également un badge-72x72.png monochrome pour les notifications.
