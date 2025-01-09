document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("signatureCanvas");
    const context = canvas.getContext("2d");
    const clearButton = document.getElementById("clearButton");
    const submitButton = document.querySelector("form button[type='submit']");

    // Set canvas dimensions explicitly
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let isDrawing = false;

    // Logging for debugging
    console.log("Canvas initialized with size:", canvas.width, "x", canvas.height);

    // Canvas drawing events
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    canvas.addEventListener("touchstart", startDrawing, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", stopDrawing);
    canvas.addEventListener("touchcancel", stopDrawing);

    clearButton.addEventListener("click", clearCanvas);

    submitButton.addEventListener("click", async function (event) {
        event.preventDefault(); // Prevent form submission for JS processing
        await submitForm();
    });

    function startDrawing(event) {
        console.log("Start drawing");
        isDrawing = true;
        context.beginPath();
        context.moveTo(getX(event), getY(event));
        event.preventDefault();
    }

    function draw(event) {
        if (!isDrawing) return;
        console.log("Drawing at:", getX(event), getY(event));
        context.lineTo(getX(event), getY(event));
        context.stroke();
        event.preventDefault();
    }

    function stopDrawing(event) {
        if (!isDrawing) return;
        console.log("Stop drawing");
        context.stroke();
        context.closePath();
        isDrawing = false;
        event.preventDefault();
    }

    function clearCanvas() {
        console.log("Canvas cleared");
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function getX(event) {
        return event.touches?.[0]?.clientX - canvas.getBoundingClientRect().left || 
               event.clientX - canvas.getBoundingClientRect().left;
    }

    function getY(event) {
        return event.touches?.[0]?.clientY - canvas.getBoundingClientRect().top || 
               event.clientY - canvas.getBoundingClientRect().top;
    }

    async function submitForm() {
        const name = document.getElementById("Nama").value;
        const kepesertaan = document.querySelector('input[name="kepesertaan"]:checked')?.value || "";
        const NIK = document.getElementById("NIK").value;
        const TTL = document.getElementById("TTL").value;
        const telp = document.getElementById("telp").value;
        const alamat = document.getElementById("alamat").value;
        const kecamatan = document.getElementById("kecamatan").value;
        const signatureDataUrl = canvas.toDataURL("image/png");

        console.log("Submitting form with signature data:", signatureDataUrl);

        try {
            const response = await fetch("https://script.google.com/macros/s/AKfycbwY4PoUhBX6CD7S1PlDK1JrioS-A_8Cg2CPH6hxEZ8BgY1FeLD-WEUPNjEtfXoXUDli/exec", {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Nama: name,
                    Kepesertaan: kepesertaan,
                    NomorIndukKependudukan: NIK,
                    TanggalLahir: TTL,
                    Telepon: telp,
                    Alamat: alamat,
                    Kecamatan: kecamatan,
                    Signature: signatureDataUrl,
                }),
            });

            if (!response.ok) {
        console.error("Server responded with an error:", response.statusText);
        alert("Error submitting form: " + response.statusText);
        return;
    }

    const data = await response.json();
    console.log("Response from server:", data);
    alert(data.message || "Form submitted successfully!");
    clearCanvas();
} catch (error) {
    console.error("Error while sending data:", error);
    alert("Error submitting form. Please check the console for details.");
};
