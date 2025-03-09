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

                // Lanjutkan proses cropping jika ukuran sesuai
                const canvas = document.getElementById('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const partWidth = img.width / 3;
                const output = document.getElementById('output');
                output.innerHTML = '';

                // Bagian Kiri (tanpa pergeseran)
                const leftCanvas = document.createElement('canvas');
                const leftCtx = leftCanvas.getContext('2d');
                leftCanvas.width = partWidth;
                leftCanvas.height = img.height;
                leftCtx.drawImage(canvas, 0, 0, partWidth, img.height, 0, 0, partWidth, img.height);

                const leftDataUrl = leftCanvas.toDataURL('image/png');
                const leftImgElement = document.createElement('img');
                leftImgElement.src = leftDataUrl;
                output.appendChild(leftImgElement);

                const leftDownloadLink = document.createElement('a');
                leftDownloadLink.href = leftDataUrl;
                leftDownloadLink.download = 'part_left.png';
                leftDownloadLink.textContent = 'Download Bagian Kiri';
                output.appendChild(leftDownloadLink);

                // Bagian Tengah (geser 65px ke kanan)
                const centerCanvas = document.createElement('canvas');
                const centerCtx = centerCanvas.getContext('2d');
                centerCanvas.width = partWidth;
                centerCanvas.height = img.height;
                centerCtx.drawImage(canvas, partWidth + 65, 0, partWidth, img.height, 0, 0, partWidth, img.height);

                const centerDataUrl = centerCanvas.toDataURL('image/png');
                const centerImgElement = document.createElement('img');
                centerImgElement.src = centerDataUrl;
                output.appendChild(centerImgElement);

                const centerDownloadLink = document.createElement('a');
                centerDownloadLink.href = centerDataUrl;
                centerDownloadLink.download = 'part_center.png';
                centerDownloadLink.textContent = 'Download Bagian Tengah';
                output.appendChild(centerDownloadLink);

                // Bagian Kanan (geser 130px ke kiri)
                const rightCanvas = document.createElement('canvas');
                const rightCtx = rightCanvas.getContext('2d');
                rightCanvas.width = partWidth;
                rightCanvas.height = img.height;
                rightCtx.drawImage(canvas, 2 * partWidth - 130, 0, partWidth, img.height, 0, 0, partWidth, img.height);

                const rightDataUrl = rightCanvas.toDataURL('image/png');
                const rightImgElement = document.createElement('img');
                rightImgElement.src = rightDataUrl;
                output.appendChild(rightImgElement);

                const rightDownloadLink = document.createElement('a');
                rightDownloadLink.href = rightDataUrl;
                rightDownloadLink.download = 'part_right.png';
                rightDownloadLink.textContent = 'Download Bagian Kanan';
                output.appendChild(rightDownloadLink);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});