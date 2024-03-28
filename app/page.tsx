"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
enum DirectoryType {
  FILE = "FILE",
  DIRECTORY = "DIRECTORY",
}

const dummy = [
  {
    name: "root ",
    directoryType: DirectoryType.DIRECTORY,
    id: uuidv4(),
    subDirectories: [],
  },
];

export default function Home() {
  const [directories, setDirectories] = useState<any>(dummy);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<any>();
  const [createType, setCreateType] = useState<any>();

  const renderDirectories = (_directories: any) => {
    if (!_directories) return null;
    if (Array.isArray(_directories)) {
      return _directories.map((directory: any) => {
        return (
          <div key={directory.id} className={"directory"}>
            <div>
              {directory.name}
              {directory.directoryType === DirectoryType.DIRECTORY && (
                <>
                  <button
                    onClick={() => {
                      setParentId(directory.id);
                      setCreateType(DirectoryType.DIRECTORY);
                    }}
                  >
                    Create Folder
                  </button>
                  <button
                    onClick={() => {
                      setParentId(directory.id);
                      setCreateType(DirectoryType.FILE);
                    }}
                  >
                    Create File
                  </button>
                </>
              )}
            </div>
            {renderDirectories(directory.subDirectories)}
          </div>
        );
      });
    } else {
      return <div className="file">{_directories.name}</div>;
    }
  };

  const onCreateRecursive = (_directories: any) => {
    if (!_directories) return undefined;
    if (Array.isArray(_directories)) {
      return _directories.map((dir) => {
        if (dir.id === parentId) {
          dir.subDirectories.push({
            name,
            directoryType: createType,
            id: uuidv4(),
            subDirectories:
              createType === DirectoryType.DIRECTORY ? [] : undefined,
          });
        } else {
          dir.subDirectories = onCreateRecursive(dir.subDirectories);
        }
        return dir;
      });
    } else {
      return _directories;
    }
  };

  const onCreate = () => {
    setDirectories(onCreateRecursive(directories));
  };

  return (
    <main style={{ display: "flex", gap: "50px" }}>
      {directories ? (
        <div>{renderDirectories(directories)}</div>
      ) : (
        <button>Create root folder </button>
      )}
      {createType && (
        <div>
          <p>Enter {createType}</p>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <button onClick={onCreate}> Create </button>
        </div>
      )}
    </main>
  );
}
