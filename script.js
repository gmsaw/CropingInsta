document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // Validasi ukuran gambar
                const requiredWidth = 3175;
                const requiredHeight = 1350;

                if (img.width !== requiredWidth || img.height !== requiredHeight) {
                    const output = document.getElementById('output');
                    output.innerHTML = `<p style="color: #ff6b6b;">Ukuran gambar harus ${requiredWidth}x${requiredHeight} piksel ganteng. Gambar yang diupload ukuran ${img.width}x${img.height} piksel kocak.</p>`;
                    return; // Hentikan proses jika ukuran tidak sesuai
                }

                // Ambil pilihan align
                const align = document.querySelector('input[name="align"]:checked').value;

                // Lanjutkan proses cropping jika ukuran sesuai
                const canvas = document.getElementById('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const partWidth = img.width / 3;
                const output = document.getElementById('output');
                output.innerHTML = '';

                // Fungsi untuk membuat potongan gambar
                const createCroppedImage = (sx, sy, sw, sh, dx, dy, dw, dh, partName) => {
                    const tempCanvas = document.createElement('canvas');
                    const tempCtx = tempCanvas.getContext('2d');
                    tempCanvas.width = dw;
                    tempCanvas.height = dh;
                    tempCtx.drawImage(canvas, sx, sy, sw, sh, dx, dy, dw, dh);

                    const dataUrl = tempCanvas.toDataURL('image/png');
                    const imgElement = document.createElement('img');
                    imgElement.src = dataUrl;
                    output.appendChild(imgElement);

                    const downloadLink = document.createElement('a');
                    downloadLink.href = dataUrl;
                    downloadLink.download = `part_${partName}.png`;
                    downloadLink.textContent = `Download Bagian ${partName}`;
                    output.appendChild(downloadLink);
                };

                // Proses cropping berdasarkan pilihan align
                if (align === 'left') {
                    // Align Kiri: Kiri tetap, tengah geser 65px kanan, kanan geser 130px kiri
                    createCroppedImage(0, 0, partWidth, img.height, 0, 0, partWidth, img.height, 'Kiri');
                    createCroppedImage(partWidth + 65, 0, partWidth, img.height, 0, 0, partWidth, img.height, 'Tengah');
                    createCroppedImage(2 * partWidth - 130, 0, partWidth, img.height, 0, 0, partWidth, img.height, 'Kanan');
                } else if (align === 'center') {
                    // Align Tengah: Tengah tetap, kiri geser 65px kanan, kanan geser 65px kiri
                    createCroppedImage(65, 0, partWidth, img.height, 0, 0, partWidth, img.height, 'Kiri');
                    createCroppedImage(partWidth, 0, partWidth, img.height, 0, 0, partWidth, img.height, 'Tengah');
                    createCroppedImage(2 * partWidth - 65, 0, partWidth, img.height, 0, 0, partWidth, img.height, 'Kanan');
                } else if (align === 'right') {
                    // Align Kanan: Kanan tetap, tengah geser 65px kiri, kiri geser 130px kiri
                    createCroppedImage(130, 0, partWidth, img.height, 0, 0, partWidth, img.height, 'Kiri');
                    createCroppedImage(partWidth - 65, 0, partWidth, img.height, 0, 0, partWidth, img.height, 'Tengah');
                    createCroppedImage(2 * partWidth, 0, partWidth, img.height, 0, 0, partWidth, img.height, 'Kanan');
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});
