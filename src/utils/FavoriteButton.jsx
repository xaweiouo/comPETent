// src/utils/FavoriteButton.jsx
import { supabase } from "../lib/supabaseClient";
import { useDispatch } from "react-redux";
import { createAsyncMessage } from "../slices/messageSlice";

export function FavoriteButton({
  sitterId,
  ownerId,
  isFavorite,
  isAuthenticated,
  user,
  onToggleDone,
}) {
  const dispatch = useDispatch();
  const handleClick = async () => {
    // 未登入：提示需登入
    if (!isAuthenticated || !user) {
      dispatch(
        createAsyncMessage({
          type: "warning",
          text: "請先登入會員，才能收藏保姆服務喔！",
        })
      );
      return;
    }

    if (!ownerId) {
      dispatch(
        createAsyncMessage({
          type: "danger",
          text: "找不到對應使用者資料，請重新登入再試一次",
        })
      );
      return;
    }

    const willFavorite = !isFavorite;

    if (willFavorite) {
      // 變成收藏：insert 一筆
      const { error } = await supabase.from("favorites").insert({
        owner_id: ownerId,
        sitter_id: sitterId,
      });

      if (error) {
        dispatch(createAsyncMessage(error));
        return;
      }
    } else {
      // 取消收藏：delete 那一筆
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("owner_id", ownerId)
        .eq("sitter_id", sitterId);

      if (error) {
        dispatch(createAsyncMessage(error));
        return;
      }
    }

    // 後端成功，再通知父層更新 state
    onToggleDone(willFavorite);
    
    dispatch(
      createAsyncMessage({
        type: "success",
        text: willFavorite ? "已加入收藏" : "已取消收藏",
      })
    );
  };

  return (
    <button
      type="button"
      className="btn p-0 border-0 bg-transparent"
      onClick={handleClick}
    >
      <i
        className={
          isFavorite
            ? "bi bi-heart-fill text-danger"
            : "bi bi-heart"
        }
      />
    </button>
  );
}
