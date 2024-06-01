import './profile.css';
import { useAuthActions, useCurrentUser } from '@/stores/authStore';
import React, { useRef, useState } from 'react';
import { Camera, Check, LogOut, Pencil, X } from 'lucide-react';
import { useAppModalActions } from '@/stores/modalStore';
import { userService } from '@/services/userService';
import jsonpatch from 'fast-json-patch';
import { Profile as ProfileType } from '@/libs/types';

const Profile = () => {
  const currentUser = useCurrentUser() as ProfileType;
  
  const { setCurrentUser } = useAuthActions();
  const fullNameRef: React.LegacyRef<HTMLInputElement> | undefined =
    useRef(null);
  const [isFullNameEditing, setIsFullNameEditting] = useState(false);
  const { updateAvatar } = useAuthActions();
  const [avatar, setAvatar] = useState({
    url: currentUser.avatar ?? '/avatar.png',
    isOrigin: true,
  });
  const { closeModal } = useAppModalActions();

  const { logout } = useAuthActions();
  const handleAvatarChanged:
    | React.ChangeEventHandler<HTMLInputElement>
    | undefined = (e) => {
    const files = e.currentTarget.files;
    if (files && files[0]) {
      if (!avatar.isOrigin) {
        URL.revokeObjectURL(avatar.url);
      }
      const url = URL.createObjectURL(files[0]);
      setAvatar({
        url,
        isOrigin: false,
      });
    }
  };
  const handleUploadAvatar:
    | React.FormEventHandler<HTMLFormElement>
    | undefined = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;

    userService.changeAvatar(file).then((result) => {
      console.log(result);
      updateAvatar(result);
      setAvatar({ url: result, isOrigin: true });
    });
  };
  const handleUpdatefullName:
    | React.MouseEventHandler<HTMLButtonElement>
    | undefined = async (e) => {
    const newFullname = fullNameRef.current?.value;
    const dif = jsonpatch.compare(
      { fullname: currentUser.fullname },
      { fullname: newFullname },
    );
    const result = await userService.changeProfile(dif);
    if (!result.isSuccess) {
      return;
    }
    setCurrentUser(result.data);
  };

  const handleLogout = () => {
    logout();
    closeModal();
  };
  return (
    <div className="profile">
      <div className="profile-top">
        <form className="profile-avatar-area" onSubmit={handleUploadAvatar}>
          <div className="profile-avatar-img-group">
            <img className="profile-avatar-img" src={avatar.url} />
            <div className="upload-img-group">
              <label className="upload-img-label" htmlFor="avatar-upload-btn">
                <Camera className="upload-img-icon" />
              </label>
              {!avatar.isOrigin && (
                <div className="confirm-actions">
                  <button className="btn-none btn-confirm">
                    <Check />
                  </button>
                  <button
                    type="button"
                    className="btn-none btn-cancel"
                    onClick={() =>
                      setAvatar({
                        url: currentUser.avatar ?? '/avatar.png',
                        isOrigin: true,
                      })
                    }>
                    <X />
                  </button>
                </div>
              )}
            </div>
            <input
              style={{ display: 'none' }}
              id="avatar-upload-btn"
              type="file"
              name="file"
              onChange={handleAvatarChanged}
            />
          </div>
        </form>
        <div className="fullname-area">
          <div className="fullname-editing-group">
            <input
              ref={fullNameRef}
              defaultValue={currentUser?.fullname}
              readOnly
              onBlur={() => {
                fullNameRef.current!.readOnly = true;
                setIsFullNameEditting(false);
              }}
            />
            {!isFullNameEditing && (
              <button
                className="btn-none btn-edit"
                onClick={() => {
                  fullNameRef.current?.focus();
                  fullNameRef.current!.readOnly = false;
                  fullNameRef.current!.selectionStart =
                    fullNameRef.current?.value.length ?? 0;
                  setIsFullNameEditting(true);
                }}>
                <Pencil className="edit-icon" />
              </button>
            )}
            {isFullNameEditing && (
              <div className="confirm-actions">
                <button
                  className="btn-none btn-confirm"
                  onMouseDown={handleUpdatefullName}>
                  <Check />
                </button>
                <button
                  className="btn-none btn-cancel"
                  onMouseDown={() =>
                    (fullNameRef.current!.value = currentUser.fullname)
                  }>
                  <X />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <h3>Thông tin cá nhân</h3>
      <div className="separator"></div>
      <div className="user-info">
        <div>
          <span>Email: </span> <span>{currentUser.email}</span>
        </div>
      </div>
      <button className="logout-btn btn-none" onClick={handleLogout}>
        <LogOut />
        Đăng xuất
      </button>
    </div>
  );
};

export default Profile;
