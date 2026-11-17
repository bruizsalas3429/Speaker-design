# Speaker System Designer

Aplicación de escritorio multiplataforma para macOS y Windows, construida con Electron. Funciona localmente y no necesita conexión a Internet una vez instalada.

## Funciones

- Distancia de primera escucha en metros.
- Ángulo total de cobertura entre 0° y 180°.
- Cantidad configurable de 1 a 64 altavoces.
- Cálculo de separación entre altavoces consecutivos y separación total entre centros de los altavoces extremos.
- Diagrama superior esquemático.
- Exportación de parámetros y resultados a JSON.

## Fórmulas

`S = 2 × D × sin(θ / 2)`

`S_total = (N - 1) × S`

El ángulo se convierte internamente a radianes para el cálculo trigonométrico.

## Requisitos para generar instaladores

- Node.js LTS (incluye npm).
- Conexión a Internet durante la primera instalación de dependencias y la generación del paquete.
- Para generar el instalador macOS: hacerlo preferentemente desde un Mac.
- Para generar el instalador Windows: hacerlo desde Windows. La generación cruzada puede requerir herramientas adicionales.

## Ejecutar en modo desarrollo

Desde esta carpeta, abre Terminal o PowerShell y ejecuta:

```bash
npm install
npm start
```

## Crear instalador macOS (.dmg y .zip)

En un Mac:

```bash
npm install
npm run dist:mac
```

Los archivos se guardarán en `dist/`.

## Crear instalador Windows (.exe)

En Windows:

```powershell
npm install
npm run dist:win
```

Se generarán un instalador NSIS y una versión portable en `dist/`.

## Nota de diseño acústico

La herramienta calcula una separación geométrica uniforme en línea. El diagrama es ilustrativo y no modela la respuesta polar real del altavoz, la orientación vertical/horizontal, retardos, fase, nivel, reflexiones ni la acústica del recinto. Para arreglos de múltiples altavoces, la fórmula aplicada a cada intervalo es una regla geométrica simplificada; debe validarse con especificaciones del fabricante y mediciones en el lugar.
