// ===============================
// TV365 V8 - player.js
// ===============================

let hls = null;

// Phát kênh
function playChannel(channel) {

    const player = document.getElementById("player");

    if (!player || !channel) return;

    // Hủy HLS cũ
    if (hls) {
        hls.destroy();
        hls = null;
    }

    // Dừng video cũ nếu có
    const oldVideo = player.querySelector("video");
    if (oldVideo) {
        oldVideo.pause();
        oldVideo.removeAttribute("src");
        oldVideo.load();
    }

    // Xóa toàn bộ nội dung
    player.innerHTML = "";

    // Tạo video
    const video = document.createElement("video");

    video.autoplay = true;
    video.controls = true;
    video.playsInline = true;

    video.style.width = "100%";
    video.style.height = "100%";
    video.style.display = "block";
    video.style.objectFit = "contain";
    video.style.background = "#000";

    player.appendChild(video);

    // Tiêu đề kênh
    const title = document.createElement("div");

    title.className = "player-title";
    title.textContent = channel.name || "";

    player.appendChild(title);

    // Nếu hỗ trợ HLS.js
    if (Hls.isSupported()) {

        hls = new Hls({

            enableWorker: true,
            lowLatencyMode: true

        });

        hls.loadSource(channel.url);

        hls.attachMedia(video);

        hls.on(Hls.Events.MEDIA_ATTACHED, function () {

            console.log("MEDIA ATTACHED");

        });

        hls.on(Hls.Events.MANIFEST_PARSED, function () {

            video.play().catch(function (err) {

                console.log(err);

            });

        });

        hls.on(Hls.Events.ERROR, function (event, data) {

            console.log("HLS ERROR", data);

        });

    }

    // Safari / iPhone
    else if (video.canPlayType("application/vnd.apple.mpegurl")) {

        video.src = channel.url;

        video.addEventListener("loadedmetadata", function () {

            video.play().catch(function (err) {

                console.log(err);

            });

        });

    }

    // Không hỗ trợ
    else {

        player.innerHTML = `
            <div class="player-placeholder">
                Thiết bị không hỗ trợ HLS
            </div>
        `;

    }

}
