"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Cropper from "react-easy-crop";

import { useUIStore } from "@/stores/ui.store";
import { useChatStore } from "@/stores/chat.store";
import { useAuthStore } from "@/stores/auth.store";
import { useChat } from "@/hooks/useChat";
import { CreateGroupRequest } from "@/types/chat.types";
import { getCroppedImage, CropArea } from "@/utils/imageCrop";

/* ---------- local user shape ---------- */
interface User {
  _id: string;
  username: string;
  profilePic?: string | null;
}

export default function CreateGroupModal() {
  const closeCreateGroup = useUIStore((s) => s.closeCreateGroup);
  const chats = useChatStore((s) => s.chats);
  const myUserId = useAuthStore((s) => s.user?._id);

  const { searchUsers, createGroup, isLoading } = useChat();

  /* ---------- local state ---------- */
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const [loadingSearch, setLoadingSearch] = useState(false);

  /* ---------- cropper state ---------- */
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(
    null
  );

  const nameInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  /* ---------- autofocus + esc ---------- */
  useEffect(() => {
    nameInputRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") resetAndClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  /* ---------- cached users ---------- */
  const cachedUsers = useMemo<User[]>(() => {
    const map = new Map<string, User>();

    chats.forEach((chat) => {
      chat.members.forEach((member) => {
        if (member._id !== myUserId) {
          map.set(member._id, {
            _id: member._id,
            username: member.username,
            profilePic: member.profilePic ?? null,
          });
        }
      });
    });

    return Array.from(map.values());
  }, [chats, myUserId]);

  /* ---------- search users ---------- */
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const t = setTimeout(async () => {
      setLoadingSearch(true);
      try {
        const res = await searchUsers({
          q: query,
          page: 1,
          limit: 10,
        });
        setSearchResults(res.users);
      } finally {
        setLoadingSearch(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [query, searchUsers]);

  /* ---------- display users ---------- */
  const displayUsers = useMemo(() => {
    const base = query.trim() ? searchResults : cachedUsers;
    return base.filter((u) => !selectedUsers.some((s) => s._id === u._id));
  }, [query, searchResults, cachedUsers, selectedUsers]);

  /* ---------- select users ---------- */
  function addUser(user: User) {
    setSelectedUsers((prev) =>
      prev.some((u) => u._id === user._id) ? prev : [...prev, user]
    );
  }

  function removeUser(id: string) {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== id));
  }

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

  /* ---------- create group ---------- */
  async function handleCreateGroup() {
    if (!groupName.trim() || selectedUsers.length < 2) return;

    const payload: CreateGroupRequest = {
      groupName: groupName.trim(),
      members: selectedUsers.map((u) => u._id),
      imageUrl: groupImage,
    };

    await createGroup(payload);

    resetAndClose();
  }

  function resetAndClose() {
    setGroupName("");
    setGroupImage(null);
    setQuery("");
    setSearchResults([]);
    setSelectedUsers([]);
    setShowCropper(false);
    closeCreateGroup();
  }

  /* ---------- UI ---------- */
  return (
    <>
      {/* Cropper */}
      {showCropper && rawImage && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-[90%] max-w-md">
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

      {/* Main modal */}
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
        <div className="w-full max-w-md   ui-elevated ui-border rounded-lg shadow-lg p-4">
          <div className="flex justify-between mb-3">
            <h2 className="text-lg font-semibold">Create Group</h2>
            <button onClick={resetAndClose}>✕</button>
          </div>

          {/* Image */}
          <div className="flex justify-center mb-3">
            <div
              onClick={() => imageInputRef.current?.click()}
              className="w-20 h-20 rounded-full ui-hover bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden"
            >
              {groupImage ? (
                <img src={groupImage} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs  text-gray-500">Add Image</span>
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

          <input
            ref={nameInputRef}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name"
            className="w-full border rounded px-3 py-2 mb-2"
          />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users"
            className="w-full border rounded px-3 py-2 mb-2"
          />

          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedUsers.map((u) => (
                <span
                  key={u._id}
                  onClick={() => removeUser(u._id)}
                  className="px-2 py-1 ui-hover rounded text-sm cursor-pointer"
                >
                  {u.username} ✕
                </span>
              ))}
            </div>
          )}

          <div className="max-h-56 overflow-y-auto border rounded">
            {loadingSearch && (
              <p className="p-3 text-sm text-gray-500">Searching…</p>
            )}
            {!loadingSearch &&
              displayUsers.map((u) => (
                <div
                  key={u._id}
                  onClick={() => addUser(u)}
                  className="p-3 ui-hover cursor-pointer"
                >
                  {u.username}
                </div>
              ))}
          </div>

          <button
            onClick={handleCreateGroup}
            disabled={
              isLoading || !groupName.trim() || selectedUsers.length < 2
            }
            className="mt-4 w-full bg-blue-600  py-2 rounded disabled:opacity-50"
          >
            {isLoading ? "Creating…" : "Create Group"}
          </button>
        </div>
      </div>
    </>
  );
}
