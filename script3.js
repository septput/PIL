document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("signatureCanvas");
    const context = canvas.getContext("2d");
    const clearButton = document.getElementById("clearButton");
    const submitButton = document.getElementById("submitButton");
    
    let isDrawing = false;
    
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);
    
    canvas.addEventListener("touchstart", startDrawing);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stopDrawing);
    canvas.addEventListener("touchcancel", stopDrawing);
    
    clearButton.addEventListener("click", clearCanvas);
    submitButton.addEventListener("click", submitForm);
    
    
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
        if (event.touches && event.touches.length > 0) {
            return event.touches[0].clientX - canvas.getBoundingClientRect().left;
        }
        return event.clientX - canvas.getBoundingClientRect().left;
    }
    
    function getY(event) {
        if (event.touches && event.touches.length > 0) {
            return event.touches[0].clientY - canvas.getBoundingClientRect().top;
        }
        return event.clientY - canvas.getBoundingClientRect().top;
    }
    
    async function submitForm() {
        const name = document.getElementById("Nama").value;
        const kepesertaan = document.querySelector("input[name='kepesertaan']:checked").nextSibling.textContent.trim();
        const NIK = document.getElementById("NIK").value;
        const TTL = document.getElementById("TTL").value;
        const telp = document.getElementById("telp").value;
        const alamat = document.querySelector("#alamat input").value;
        const signatureDataUrl = canvas.toDataURL("image/png");

        try {
            const response = await fetch("YOUR_WEB_APP_URL", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Nama: name,
                    Kepesertaan: kepesertaan,
                    NomorIndukKependudukan: NIK,
                    TanggalLahir: TTL,
                    Telepon: telp,
                    Alamat: alamat,
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