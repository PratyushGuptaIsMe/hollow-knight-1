function exportSave() {
    indexedDB.open("/idbfs").onsuccess = e => {
  const db = e.target.result;
  const tx = db.transaction("FILE_DATA", "readonly");
  const store = tx.objectStore("FILE_DATA");

  const req = store.getAll();
  const keysReq = store.getAllKeys();

  req.onsuccess = () => {
    keysReq.onsuccess = () => {
      const values = req.result;
      const keys = keysReq.result;

      const exportData = keys.map((key, i) => {
        const entry = values[i];
        let contents = entry.contents;

        // Convert Int8Array → object with numeric keys
        if (contents instanceof Int8Array) {
          const obj = {};
          for (let j = 0; j < contents.length; j++) {
            obj[j] = contents[j];
          }
          contents = obj;
        }

        return {
          key: key,
          value: {
            timestamp: entry.timestamp,
            mode: entry.mode,
            contents: contents
          }
        };
      });

      const blob = new Blob(
        [JSON.stringify(exportData, null, 2)],
        { type: "application/json" }
      );

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "hk-save-export.json";
      a.click();
      URL.revokeObjectURL(url);

      console.log("✔️ Export complete");
    };
  };
    };
}

