function handleCircleClick() {
    chrome.runtime.sendMessage({ action: "clickedOnScreenButton" });
}

// export function injectCircle() {
//     if (document.getElementById("buyhive-root")) return;

//     const host = document.createElement("div");
//     host.id = "buyhive-root";
//     host.style.position = "fixed";
//     host.style.zIndex = "2147483647";
//     host.style.right = "16px";
//     host.style.top = "16px";

//     const shadow = host.attachShadow({ mode: "open" });

//     const button = document.createElement("div");
//     button.style.width = "56px";
//     button.style.height = "56px";
//     button.style.borderRadius = "50%";
//     button.style.background = "hsl(42,95%,66%,100%)";
//     button.style.color = "white";
//     button.style.display = "flex";
//     button.style.alignItems = "center";
//     button.style.justifyContent = "center";
//     button.style.textAlign = "center";
//     button.style.cursor = "pointer";

//     const plus = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//     plus.setAttribute("width", "32");
//     plus.setAttribute("height", "32");
//     plus.setAttribute("viewBox", "0 0 24 24");
//     plus.innerHTML = `
//         <path d="M12 5v14M5 12h14"
//         stroke="white"
//         stroke-width="2"
//         stroke-linecap="round"/>
//     `;

//     button.appendChild(plus);
//     button.addEventListener("click", handleCircleClick);

//     shadow.appendChild(button);
//     document.documentElement.appendChild(host);
// }

export function injectCircle() {
    if (document.getElementById("buyhive-root")) return;

    const host = document.createElement("div");
    host.id = "buyhive-root";
    host.style.position = "fixed";
    host.style.zIndex = "2147483647";
    host.style.right = "16px";
    host.style.top = "16px";

    const shadow = host.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = `
        .button {
            width: 56px;
            height: 56px;
            border-radius: 9999px;
            background: hsl(42,95%,66%);
            color: white;
            display: grid;
            place-items: center;
            cursor: pointer;
            box-shadow: 0 10px 25px rgba(0,0,0,.25);
            font: 700 32px/1 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
            user-select: none;
        }

        .popup {
            position: absolute;
            top: 64px;
            right: 0;
            width: 280px;
            background: white;
            border-radius: 14px;
            box-shadow: 0 14px 30px rgba(0,0,0,.18);
            padding: 12px;
            font: 500 13px/1.3 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
            color: #111;
        }

        .row { display: flex; gap: 10px; align-items: center; }
        .thumb { width: 44px; height: 44px; border-radius: 10px; background: #eee; flex: 0 0 auto; object-fit: cover; }
        .title { font-weight: 650; font-size: 13px; max-height: 34px; overflow: hidden; }
        .price { opacity: .75; margin-top: 2px; }
        .btn {
            margin-top: 10px;
            width: 100%;
            border: 0;
            border-radius: 10px;
            padding: 10px 12px;
            background: hsl(42,95%,66%);
            color: white;
            cursor: pointer;
            font-weight: 650;
        }
        .btn:disabled { opacity: .6; cursor: not-allowed; }
    `;

    const button = document.createElement("div");
    button.className = "button";

    const plus = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    plus.setAttribute("width", "32");
    plus.setAttribute("height", "32");
    plus.setAttribute("viewBox", "0 0 24 24");
    plus.innerHTML = `
        <path d="M12 5v14M5 12h14"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"/>
    `;

    button.appendChild(plus);

    const popup = document.createElement("div");
    popup.className = "popup";
    popup.style.display = "none";

    // Dummy placeholders — replace with your actual extraction result
    const product = {
        title: document.title,
        price: "—",
        image: ""
    };

    popup.innerHTML = `
        <div class="row">
            <img class="thumb" />
            <div>
                <div class="title"></div>
                <div class="price"></div>
            </div>
            </div>
        <button class="btn">Add to BuyHive</button>
    `;

    const img = popup.querySelector("img.thumb");
    const titleEl = popup.querySelector(".title");
    const priceEl = popup.querySelector(".price");
    const btn = popup.querySelector("button.btn");

    titleEl.textContent = product.title;
    priceEl.textContent = product.price;
    if (product.image) img.src = product.image;

    button.addEventListener("click", async() => {
        chrome.runtime.sendMessage({ action: "scrapeItem" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return;
            }

            if (!response || response.status !== "success") {
                console.log("Scrape failed");
                return;
            }

            const item = response.data;
            console.log(item)
            if (!item) return;

            if (!item.image) {
                item.src = "https://blocks.astratic.com/img/general-img-square.png";
            }

            

            titleEl.textContent = item.name;
            priceEl.textContent = item.price;
            if (img) img.src = item.image;
        });
        popup.style.display = popup.style.display === "none" ? "block" : "none";
    });

    btn.addEventListener("click", async () => {
        btn.disabled = true;
        btn.textContent = "Adding…";

        chrome.runtime.sendMessage(
        { action: "addItemToCart", payload: product },
            (res) => {
                btn.disabled = false;
                btn.textContent = res?.status === "success" ? "Added ✓" : "Add to BuyHive";
            }
        );
    });

    shadow.append(style, button, popup);
    document.documentElement.appendChild(host);
}