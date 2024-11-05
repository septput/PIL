document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("signatureCanvas");
    const context = canvas.getContext("2d");
    const clearButton = document.getElementById("clearButton");
    const submitButton = document.querySelector("form button[type='submit']");

    let isDrawing = false;

    // Canvas drawing functions
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    canvas.addEventListener("touchstart", startDrawing);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stopDrawing);
    canvas.addEventListener("touchcancel", stopDrawing);

    clearButton.addEventListener("click", clearCanvas);
    submitButton.addEventListener("click", function(event) {
        event.preventDefault();  // Prevent form submission to allow JavaScript processing
        submitForm();
    });

    function startDrawing(event) {
        isDrawing = true;
        context.beginPath();
        context.moveTo(getX(event), getY(event));
        event.preventDefault();
    }

    function draw(event) {
        if (!isDrawing) return;
        context.lineTo(getX(event), getY(event));
        context.stroke();
        event.preventDefault();
    }

    function stopDrawing(event) {
        if (!isDrawing) return;
        context.stroke();
        context.closePath();
        isDrawing = false;
        event.preventDefault();
    }

    function clearCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function getX(event) {
        return (event.touches && event.touches.length > 0) ?
            event.touches[0].clientX - canvas.getBoundingClientRect().left :
            event.clientX - canvas.getBoundingClientRect().left;
    }

    function getY(event) {
        return (event.touches && event.touches.length > 0) ?
            event.touches[0].clientY - canvas.getBoundingClientRect().top :
            event.clientY - canvas.getBoundingClientRect().top;
    }

    async function submitForm() {
        const name = document.getElementById("Nama").value;
        const kepesertaan = document.querySelector('input[name="kepesertaan"]:checked')?.value || "";
        const NIK = document.getElementById("NIK").value;
        const TTL = document.getElementById("TTL").value;
        const telp = document.getElementById("telp").value;
        const alamat = document.getElementById("alamat").value;
        const kecamatan = document.querySelector('input[name="kecamatan"]:checked')?.value || "";
        const signatureDataUrl = canvas.toDataURL("image/png");

        try {
            const response = await fetch("https://script.google.com/macros/s/AKfycbyHNdfvoqceCUEPXa8vK3-Gqy9qY6DJSGt46DKpq1BtsgJ_KdZ_AKbk7RqDR0PE267R/exec", {
                method: "POST",
                mode: 'cors',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Nama: name,
                    Kepesertaan: kepesertaan,
                    NomorIndukKependudukan: NIK,
                    TanggalLahir: TTL,
                    Telepon: telp,
                    Alamat: alamat,
                    Kecamatan: kecamatan,
                    Signature: signatureDataUrl
                })
            });
            const data = await response.json();
            alert(data.message);
            clearCanvas();
        } catch (error) {
            console.error("Error:", error);
        }
    }
});
