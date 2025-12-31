
"use client";

import { useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";

import { useUIStore } from "@/stores/ui.store";
import { useChat } from "@/hooks/useChat";
import { CreateGroupRequest } from "@/types/chat.types";
import { getCroppedImage, CropArea } from "@/utils/imageCrop";

import UserPicker, {
  PickerUser,
} from "@/components/common/UserPicker";
import { useAlertStore } from "@/stores/alert.store";

export default function CreateGroupModal() {
  const closeCreateGroup = useUIStore((s) => s.closeCreateGroup);
  const { createGroup, isLoading } = useChat();
   const {show}= useAlertStore()

 
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<PickerUser[]>([]);


  const [rawImage, setRawImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CropArea | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  function resetAndClose() {
    setGroupName("");
    setGroupImage(null);
    setSelectedUsers([]);
    setShowCropper(false);
    closeCreateGroup();
  }

// close modal

  // useEffect(() => {
  //   nameInputRef.current?.focus();

  //   const onKeyDown = (e: KeyboardEvent) => {
  //     if (e.key === "Escape") resetAndClose();
  //   };

  //   window.addEventListener("keydown", onKeyDown);
  //   return () => window.removeEventListener("keydown", onKeyDown);
  // }, []);

  /* ---------- image select ---------- */
  function handleImageSelect(file: File) {
    const url = URL.createObjectURL(file);
    setRawImage(url);
    setShowCropper(true);
  }

  const onCropComplete = (_: CropArea, cropped: CropArea) => {
    setCroppedAreaPixels(cropped);
  };

  async function handleCropConfirm() {
    if (!rawImage || !croppedAreaPixels) return;

    const cropped = await getCroppedImage(rawImage, croppedAreaPixels);
    setGroupImage(cropped);
    setRawImage(null);
    setShowCropper(false);
  }
//   async function handleCropConfirm() {
//   if (!rawImage || !croppedAreaPixels) return;

//   const croppedBlob = await getCroppedImage(rawImage, croppedAreaPixels);

//   const previewUrl = URL.createObjectURL(croppedBlob);

//   setGroupImage(previewUrl);
//   setRawImage(null);
//   setShowCropper(false);
// }

  /* ---------- create group ---------- */
  async function handleCreateGroup() {
    try{
    if (!groupName.trim() || selectedUsers.length < 2) return;

    const payload: CreateGroupRequest = {
      groupName: groupName.trim(),
      members: selectedUsers.map((u) => u._id),
      imageUrl: groupImage,
    };

    await createGroup(payload);
  
    resetAndClose();
  }catch(err){
show("something went wrong", "error") ;
console.log(err);
  }
  }



  /* ---------- UI ---------- */
  return (
    <>
      {/* Cropper */}
      {showCropper && rawImage && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center">
          <div className="p-4 ui-elevated rounded w-[90%] max-w-md">
            <div className="relative w-full h-64 bg-black">
              <Cropper
                image={rawImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full mt-3"
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowCropper(false)}
                className="flex-1 border py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCropConfirm}
                className="flex-1 bg-blue-600 ui-text py-2 rounded"
              >
                Crop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main modal */}
       <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"> {/* onClick={resetAndClose}> */}
        <div className="w-full max-w-md rounded-lg shadow-lg p-4 ui-elevated"  onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between mb-3">
            <h2 className="text-lg font-semibold">Create Group</h2>
            <button onClick={resetAndClose}>✕</button>
          </div>

          {/* Image */}
          <div className="flex justify-center mb-3">
            <div
              onClick={() => imageInputRef.current?.click()}
              className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden"
            >
              {groupImage ? (
                <img
                  src={groupImage}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-500">
                  Add Image
                </span>
              )}
            </div>

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageSelect(file);
              }}
            />
          </div>

          {/* Group name */}
          <input
            ref={nameInputRef}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name"
            className="w-full border rounded px-3 py-2 mb-3"
          />

          {/* USER PICKER (REUSED) */}
          <UserPicker
            selectedUsers={selectedUsers}
            onAdd={(u) =>
              setSelectedUsers((prev) => [...prev, u])
            }
            onRemove={(id) =>
              setSelectedUsers((prev) =>
                prev.filter((u) => u._id !== id)
              )
            }
          />

          <button
            onClick={handleCreateGroup}
            disabled={
              isLoading ||
              !groupName.trim() ||
              selectedUsers.length < 2
            }
            className="mt-4 w-full bg-blue-600 py-2 rounded  disabled:opacity-50"
          >
            {isLoading ? "Creating…" : "Create Group"}
          </button>
        </div>
      </div>
    </>
  );
}

