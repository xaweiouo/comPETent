import { supabase } from '../lib/supabaseClient';
// import * as bootstrap from 'bootstrap';
import {  useEffect } from 'react';
import { useForm } from 'react-hook-form';

import feetIcon from '../../src/images/icons/feet_icon.png'
import dogIcon from '../../src/images/icons/dog_icon.png'
import cakeIcon from '../../src/images/icons/cake_icon.png'
import calendarIcon from '../../src/images/icons/calendar_icon.png'
import { useDispatch } from 'react-redux';
import { createAsyncMessage } from '../slices/messageSlice';

function PetDetailModal({ key, ownerId, pet, innerRef, mode, setMode, setOwnerPets, closeModal }) {

  // const [isEditing, setIsEditing] = useState(false);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    // formState: { errors }
  } = useForm({
    defaultValues: pet || {},
    // mode: 'onChange'
  });

  const onSubmit = async (formData) => {
    try {
      let result;

      if (mode === 'create') {
        // --- 新增模式 ---
        // 注意：這裡可能需要補上 owner_id，通常從 redux 的 user 抓
        const newPetData = { ...formData, owner_id: ownerId };
        delete newPetData.id; // 新增時不需要傳入 id

        result = await supabase
          .from('pets')
          .insert([newPetData])
          .select()
          .single();

        if (result.error) throw result.error;

        // 更新父元件列表：將新寵物加進陣列
        setOwnerPets((prev) => [...prev, result.data]);
        dispatch(createAsyncMessage({ text: '新增成功' }));

      } else {
        // --- 編輯模式 ---
        result = await supabase
          .from('pets')
          .update(formData)
          .eq('id', formData.id)
          .select()
          .single();

        if (result.error) throw result.error;

        // 更新父元件列表：替換掉舊的那一筆
        setOwnerPets((prevPets) =>
          prevPets.map((prevPet) => (prevPet.id === formData.id ? result.data : prevPet))
        );
        dispatch(createAsyncMessage({ text: '修改成功' }));
      }

      closeModal(); // 成功後關閉
    } catch (error) {
      dispatch(createAsyncMessage(error));
    }
  };

  const onDelete = async () => {
    // 1. 確認使用者是否真的要刪除（尤其是編輯/查看模式時）
    // if (!pet?.id) return;

    // const confirmDelete = window.confirm(`確定要刪除 ${pet.name} 的資料嗎？此動作無法復原。`);
    // if (!confirmDelete) return;

    try {
      // 2. 呼叫 Supabase 刪除資料
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', pet.id);

      if (error) throw error;

      // 3. 更新父元件列表：過濾掉被刪除的那一筆
      setOwnerPets((prevPets) => prevPets.filter((p) => p.id !== pet.id));

      // 4. 發送成功訊息
      dispatch(createAsyncMessage({ text: '寵物資料已刪除' }));

      // 5. 關閉 Modal
      closeModal();
    } catch (error) {
      dispatch(createAsyncMessage({ text: `刪除失敗: ${error.message}`, type: 'error' }));
    }
  };

  // 點擊「編輯」
  // const handleEdit = (user) => {
  //   setIsEditing(true);
  //   setModalMode({
  //     // show: true,
  //     mode: 'edit',
  //     // data: user // 傳入當前那列的資料
  //   });
  // };

  // 標題動態切換
  const titleMap = {
    create: "新增毛孩",
    edit: "編輯毛孩",
    view: "毛孩資訊"
  };

  useEffect(() => {
    if (mode === 'create') {
      reset(
        {
          name: '',
          species: '',
          size: '',
          birth_date: '',
          last_vaccination_date: '',
          gender: '',
          is_neutered: '',
          note: '',
          photo_url: 'https://images2.imgbox.com/9b/a2/d1N0JkEJ_o.jpg' // 如果有預設圖片網址也可以放這
        }
      )
    } else if (pet) {
      // setSelectedPet({...pet})
      reset({ ...pet, is_neutered: pet.is_neutered === null ? "" : String(pet.is_neutered) })
    }
  }, [pet, mode, reset])

  return (
    <>
      <div
        key={key}
        className="modal fade"
        ref={innerRef}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{titleMap[mode]}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              // onClick={() => setIsEditing(false)}
              >

              </button>
            </div>
            <div className="modal-body">
              <form id="editForm" onSubmit={handleSubmit(onSubmit)}>
                <div className="row g-4 align-items-start">
                  {/* 左側：照片 + 名字 */}
                  <div className="col-12 col-md-3 d-flex flex-column align-items-center">
                    <div className="w-100 mb-3">
                      <div className="ratio" style={{ "--bs-aspect-ratio": "133.33%" }}>
                        <img
                          src={pet?.photo_url || 'https://images2.imgbox.com/9b/a2/d1N0JkEJ_o.jpg'}
                          alt={pet?.name || "new pet"}
                          className="w-100 h-100 rounded-4"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    </div>

                    <div className="w-100">
                      <label className="form-label">名字</label>
                      <input
                        type="text"
                        className="form-control rounded-pill border border-warning"
                        // value={isEditing ? '' : pet?.name}
                        {...register('name', {
                          required: "請輸入寵物名稱",
                        })}
                        // onChange={(e) =>
                        //   setNewPet((prev) => ({ ...prev, name: e.target.value }))
                        // }
                        placeholder="請輸入名字"
                        style={{ backgroundColor: "#FEF3E2" }}
                        disabled={mode === 'view'}
                      />
                    </div>
                  </div>

                  {/* 右側欄位：種類 / 體型 / 出生日期 / 疫苗日期 / 性別 / 是否結紮 / 備註 */}
                  <div className="col-12 col-md-9">
                    <div className="row g-3">
                      {/* 種類 */}
                      <div className="col-12 col-sm-6">
                        <label className="form-label">種類</label>
                        <div className="input-group rounded-pill overflow-hidden border border-warning">
                          <span
                            className="input-group-text border-0"
                            style={{ backgroundColor: "#FEF3E2" }}
                          >
                            <img
                              src={feetIcon}
                              alt="feet"
                              width="20"
                              height="20"
                            />
                          </span>
                          <select
                            className="form-select"
                            style={{ backgroundColor: "#FEF3E2" }}
                            {...register('species', {
                              required: "請選擇寵物種類",
                            })}
                            disabled={mode === 'view'}
                          >
                            <option value="">請選擇種類</option>
                            <option value="dog">狗</option>
                            <option value="cat">貓</option>
                            <option value="bird">鳥</option>
                            <option value="fish">魚</option>
                            <option value="rabbit">兔</option>
                            <option value="rodent">鼠</option>
                            <option value="reptiles">爬蟲</option>
                            <option value="others">其他</option>
                          </select>
                        </div>
                      </div>

                      {/* 體型 */}
                      <div className="col-12 col-sm-6">
                        <label className="form-label">體型</label>
                        <div className="input-group rounded-pill overflow-hidden border border-warning">
                          <span
                            className="input-group-text border-0"
                            style={{ backgroundColor: "#FEF3E2" }}
                          >
                            <img
                              src={dogIcon}
                              alt="dog"
                              width="20"
                              height="20"
                            />
                          </span>
                          <select
                            className="form-select border-0"
                            style={{ backgroundColor: "#FEF3E2" }}
                            {...register('size', {
                              required: "請選擇體型",
                            })}
                            disabled={mode === 'view'}
                          // value={pet?.size}
                          // onChange={(e) =>
                          //   setNewPet((prev) => ({ ...prev, size: e.target.value }))
                          // }
                          >
                            <option value="">請選擇體型</option>
                            <option value="small">小型（10kg以下）</option>
                            <option value="medium">中型（10-20kg）</option>
                            <option value="large">大型（20kg以上）</option>
                          </select>
                        </div>
                      </div>

                      {/* 出生日期 */}
                      <div className="col-12 col-sm-6">
                        <label className="form-label">出生日期</label>
                        <div className="input-group rounded-pill overflow-hidden border border-warning">
                          <span
                            className="input-group-text border-0"
                            style={{ backgroundColor: "#FEF3E2" }}
                          >
                            <img
                              src={cakeIcon}
                              alt="cake"
                              width="20"
                              height="20"
                            />
                          </span>
                          <input
                            type="date"
                            className="form-control border-0"
                            style={{ backgroundColor: "#FEF3E2" }}
                            {...register('birth_date', {
                              // required: "請輸入寵物名稱",
                            })}
                            disabled={mode === 'view'}
                          // value={pet?.birth_date || ""}
                          // onChange={(e) =>
                          //   setNewPet((prev) => ({ ...prev, birth_date: e.target.value }))
                          // }
                          />
                        </div>
                      </div>

                      {/* 上次施打疫苗日期 */}
                      <div className="col-12 col-sm-6">
                        <label className="form-label">上次施打疫苗日期</label>
                        <div className="input-group rounded-pill overflow-hidden border border-warning">
                          <span
                            className="input-group-text border-0"
                            style={{ backgroundColor: "#FEF3E2" }}
                          >
                            <img
                              src={calendarIcon}
                              alt="calendar"
                              width="20"
                              height="20"
                            />
                          </span>
                          <input
                            type="date"
                            className="form-control border-0"
                            style={{ backgroundColor: "#FEF3E2" }}
                            {...register('last_vaccination_date', {
                              // required: "請輸入寵物名稱",
                            })}
                            disabled={mode === 'view'}
                          // value={pet?.last_vaccination_date || ""}
                          // onChange={(e) =>
                          //   setNewPet((prev) => ({
                          //     ...prev,
                          //     last_vaccination_date: e.target.value,
                          //   }))
                          // }
                          />
                        </div>
                      </div>

                      {/* 性別 */}
                      <div className="col-12 col-sm-6">
                        <label className="form-label d-block">性別</label>
                        <div className="btn-group" role="group" aria-label="pet gender">
                          <input
                            type="radio"
                            className="btn-check"
                            // name="newPetGender"
                            id="newPetGenderMale"
                            {...register('gender')}
                            disabled={mode === 'view'}
                            value="male"
                          // checked={pet?.gender === "male"}
                          // onChange={(e) =>
                          //   setNewPet((prev) => ({ ...prev, gender: e.target.value }))
                          // }
                          />
                          <label className="btn pet-toggle-pill" htmlFor="newPetGenderMale">
                            公
                          </label>

                          <input
                            type="radio"
                            className="btn-check"
                            // name="newPetGender"
                            id="newPetGenderFemale"
                            {...register('gender')}
                            disabled={mode === 'view'}
                            value="female"
                          // checked={pet?.gender === "female"}
                          // onChange={(e) =>
                          //   setNewPet((prev) => ({ ...prev, gender: e.target.value }))
                          // }
                          />
                          <label
                            className="btn pet-toggle-pill"
                            htmlFor="newPetGenderFemale"
                          >
                            母
                          </label>
                        </div>
                      </div>

                      {/* 是否結紮 */}
                      <div className="col-12 col-sm-6">
                        <label className="form-label d-block">是否結紮</label>
                        <div className="btn-group" role="group" aria-label="pet neuter">
                          <input
                            type="radio"
                            className="btn-check"
                            // name="newPetNeuter"
                            id="newPetNeuterYes"
                            {...register('is_neutered')}
                            disabled={mode === 'view'}
                            value={true}
                          // checked={pet?.is_neutered === true}
                          // onChange={() =>
                          //   setNewPet((prev) => ({ ...prev, is_neutered: true }))
                          // }
                          />
                          <label className="btn pet-toggle-pill" htmlFor="newPetNeuterYes">
                            是
                          </label>

                          <input
                            type="radio"
                            className="btn-check"
                            // name="newPetNeuter"
                            id="newPetNeuterNo"
                            {...register('is_neutered')}
                            disabled={mode === 'view'}
                            value={false}
                          // checked={pet?.is_neutered === false}
                          // onChange={() =>
                          //   setNewPet((prev) => ({ ...prev, is_neutered: false }))
                          // }
                          />
                          <label className="btn pet-toggle-pill" htmlFor="newPetNeuterNo">
                            否
                          </label>
                        </div>
                      </div>

                      {/* 備註 */}
                      <div className="col-12">
                        <label className="form-label">備註</label>
                        <textarea
                          className="form-control"
                          style={{ backgroundColor: "#FEF3E2" }}
                          rows="4"
                          // value={pet?.note}
                          // onChange={(e) =>
                          //   setNewPet((prev) => ({ ...prev, note: e.target.value }))
                          // }
                          placeholder="例如：怕生、對貓敏感、曾開刀等"
                          {...register('note', {
                            // required: "請輸入寵物名稱",
                          })}
                          disabled={mode === 'view'}
                        />
                      </div>

                      {/* 按鈕列 */}
                      <div className="col-12 d-flex justify-content-end">
                        {/* <button
                          type="button"
                          className="btn btn-secondary me-2"
                          // onClick={() => {
                          //   setIsAddingPet(false);
                          //   setNewPet({
                          //     name: "",
                          //     species: "",
                          //     size: "",
                          //     birth_date: "",
                          //     gender: "unknown",
                          //     is_neutered: false,
                          //     last_vaccination_date: "",
                          //     note: "",
                          //     photo_url: "",
                          //   });
                          // }}
                        >
                          取消
                        </button> */}
                        {/* <button type="submit" className="btn btn-primary">
                          送出
                        </button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer justify-content-between">
              {mode !== 'create' ? <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={onDelete}>
                刪除此寵物
              </button> : <div></div>}


              {mode === 'view' ? <button
                key='edit'
                type="button"
                className="btn btn-primary text-white"
                onClick={() => setMode('edit')}
              >
                編輯
              </button> : <button key='submit' type="submit" className="btn btn-primary text-white" form="editForm">
                送出
              </button>}

            </div>
          </div>
        </div>
      </div>
    </>
  )
};
export default PetDetailModal;