const inputElement = document.getElementById("upload-file");
const infoElement = document.querySelector(".file-info");

// Web3 instance
const web3 = new Web3(window.ethereum);

// Contract yükleyici fonksiyon (otomatik abi + address alır)
async function loadContract() {
  const response = await fetch("DocumentVerifier.json"); // Buraya kopyaladığın json dosyası
  const contractJson = await response.json();

  const abi = contractJson.abi;
  const networkId = await web3.eth.net.getId();
  const contractAddress = contractJson.networks[networkId]?.address;

  if (!contractAddress) {
    alert("Bu ağda contract bulunamadı.");
    return null;
  }

  return new web3.eth.Contract(abi, contractAddress);
}

// Dosya seçildiğinde hash hesaplama
inputElement.addEventListener("change", async () => {
  const file = inputElement.files[0];
  if (!file) return;

  const hash = await getFileHash(file);
  infoElement.innerText = "SHA-256 Hash: " + hash;
});

// DOĞRULA butonu (verifyDocumentHash çağrısı)
document.getElementById("submit-button").addEventListener("click", async () => {
  const file = inputElement.files[0];
  if (!file) return alert("Dosya seçilmedi!");

  const hash = await getFileHash(file);
  console.log("Hash:", hash);

  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const contract = await loadContract();
    if (!contract) return;

    try {
      const result = await contract.methods.verifyDocumentHash(hash).call();

      // Sonuçları ekranda göster
      document.getElementById("result-box").style.display = "block";
      document.getElementById("result-hash").innerText = hash;
      document.getElementById("result-docType").innerText = result[0];
      document.getElementById("result-issuer").innerText = result[1];
      document.getElementById("result-timestamp").innerText = new Date(result[2] * 1000).toLocaleString();

    } catch (e) {
      alert("❌ Belge blockchain'de kayıtlı değil.");

      // Sonuç kutusunu gizle
      document.getElementById("result-box").style.display = "none";
    }
  } else {
    alert("MetaMask yüklü değil!");
  }
});

// KAYDET butonu (storeDocumentHash çağrısı)
document.getElementById("save-button").addEventListener("click", async () => {
  const file = inputElement.files[0];
  if (!file) return alert("Dosya seçilmedi!");

  const hash = await getFileHash(file);
  const docType = prompt("Belge türünü girin (örneğin: 'vergi levhası')");

  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    const contract = await loadContract();
    if (!contract) return;

    try {
      await contract.methods.storeDocumentHash(hash, docType).send({ from: accounts[0] });
      alert("✅ Belge başarıyla blockchain'e kaydedildi!");
    } catch (e) {
      alert("❌ Kayıt başarısız oldu: " + e.message);
    }
  } else {
    alert("MetaMask yüklü değil!");
  }
});

// TEMİZLE butonu
document.getElementById("reset-btn").addEventListener("click", () => {
  inputElement.value = "";
  infoElement.innerText = "Dosya seçilmedi";
});

// SHA-256 Hash hesaplama
async function getFileHash(file) {
  // Dosya içeriğini oku
  const buffer = await file.arrayBuffer();

  // Metadata hazırla (örneğin dosya adı, boyutu, son değiştirilme tarihi)
  const metadataString = `${file.name}-${file.size}-${file.lastModified}`;
  const encoder = new TextEncoder();
  const metadataBuffer = encoder.encode(metadataString);

  // İçerik + metadata birleştir
  const combinedBuffer = new Uint8Array(buffer.byteLength + metadataBuffer.byteLength);
  combinedBuffer.set(new Uint8Array(buffer), 0);
  combinedBuffer.set(metadataBuffer, buffer.byteLength);

  // SHA-256 hash hesapla
  const digest = await crypto.subtle.digest("SHA-256", combinedBuffer);
  return "0x" + Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}

