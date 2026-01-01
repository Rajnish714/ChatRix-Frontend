"use client";

import { useRef, useState } from "react";
import Cropper from "react-easy-crop";

import BaseModal from "@/components/ui/modal/BaseModal";
import { useUIStore } from "@/stores/ui.store";
import { useAuth } from "@/hooks/useAuth";
import { useAlertStore } from "@/stores/alert.store";
import { getCroppedImage, CropArea } from "@/utils/imageCrop";

export default function UpdateProfileModal() {
  const { activeModal, closeModal } = useUIStore();
  const { user, updateProfile } = useAuth();
  const { show } = useAlertStore();

  const fileRef = useRef<HTMLInputElement>(null);

  const [rawImage, setRawImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // cropper state
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CropArea | null>(null);

  if (activeModal !== "updateProfile") return null;
  if (!user) return null;

  /* ---------- image select ---------- */
  function handleSelect(file: File) {
    const url = URL.createObjectURL(file);
    setRawImage(url);
    setShowCropper(true);
  }

  const onCropComplete = (_: CropArea, cropped: CropArea) => {
    setCroppedAreaPixels(cropped);
  };

  async function handleCropConfirm() {
    if (!rawImage || !croppedAreaPixels) return;

    const blob = await getCroppedImage(rawImage, croppedAreaPixels);

    const croppedFile = new File([blob], "profile.webp", {
      type: blob.type,
    });

    setFile(croppedFile);
    setPreview(URL.createObjectURL(croppedFile));

    setRawImage(null);
    setShowCropper(false);
  }

  /* ---------- save ---------- */
async function handleSave() {
  if (!file || !user) return;

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    const res = await updateProfile(formData);

    // ✅ minimal local update
    user.profilePic = res.profilePic;

    show("Profile updated", "success");
    closeModal();
  } catch (e) {
    console.error(e);
    show("Failed to update profile", "error");
  } finally {
    setLoading(false);
  }
}
  return (
    <>
      {/* ---------- CROPPER ---------- */}
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
                className="flex-1 bg-blue-600 text-white py-2 rounded"
              >
                Crop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- MAIN MODAL ---------- */}
      <BaseModal onClose={closeModal} title="Edit Profile">
        <div className="p-4 text-center">
          <div
            onClick={() => fileRef.current?.click()}
            className="w-28 h-28 mx-auto rounded-full overflow-hidden cursor-pointer bg-gray-200"
          >
            <img
              src={
                preview ??
                user.profilePic ??
                "/assets/user-rollback.png"
              }
              className="w-full h-full object-cover"
              alt="profile"
            />
          </div>

          <input
            ref={fileRef}
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleSelect(f);
            }}
          />

          <p className="mt-3 text-sm text-gray-500">
            Tap image to change
          </p>

          <button
            onClick={handleSave}
            disabled={!file || loading}
            className="mt-5 w-full bg-blue-600 py-2 rounded text-white disabled:opacity-50"
          >
            {loading ? "Saving…" : "Save"}
          </button>
        </div>
      </BaseModal>
    </>
  );
}
