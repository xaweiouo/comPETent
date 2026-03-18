function PetDetailContent({ feetIcon, isAddingPet, selectedPet, handleAddPet, newPet, isEditing, editingPetForm, fallbackPetImage, setNewPet, dogIcon }) {
  return (
    <>
      <section className="booking-pet-form">
        <div className="card border-0 rounded-4 background-transparent">
          <div className="card-body px-0 py-2">
            <div className="d-flex align-items-center mb-4">
              <img src={feetIcon} alt="feet" width="20" height="20" className="me-2" />
              <h4 className="text-primary mb-0">毛小孩詳細資料</h4>
            </div>

            {isAddingPet || !selectedPet ? (
              <form
                className="rounded-4 p-4"
                style={{ backgroundColor: "#FFB22C33" }}
                onSubmit={handleAddPet}
              >
                <div className="row g-4 align-items-start">
                  {/* 左側：照片 + 名字 */}
                  <div className="col-12 col-md-3 d-flex flex-column align-items-center">
                    <div className="w-100 mb-3">
                      <div className="ratio" style={{ "--bs-aspect-ratio": "133.33%" }}>
                        <img
                          src={newPet.photo_url || fallbackPetImage}
                          alt={newPet.name || "new pet"}
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
                        value={newPet.name}
                        onChange={(e) =>
                          setNewPet((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="請輸入名字"
                        style={{ backgroundColor: "#FEF3E2" }}
                        required
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
                            value={newPet.species}
                            onChange={(e) =>
                              setNewPet((prev) => ({ ...prev, species: e.target.value }))
                            }
                            required
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
                            value={newPet.size}
                            onChange={(e) =>
                              setNewPet((prev) => ({ ...prev, size: e.target.value }))
                            }
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
                            value={newPet.birth_date || ""}
                            onChange={(e) =>
                              setNewPet((prev) => ({ ...prev, birth_date: e.target.value }))
                            }
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
                            value={newPet.last_vaccination_date || ""}
                            onChange={(e) =>
                              setNewPet((prev) => ({
                                ...prev,
                                last_vaccination_date: e.target.value,
                              }))
                            }
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
                            name="newPetGender"
                            id="newPetGenderMale"
                            value="male"
                            checked={newPet.gender === "male"}
                            onChange={(e) =>
                              setNewPet((prev) => ({ ...prev, gender: e.target.value }))
                            }
                          />
                          <label className="btn pet-toggle-pill" htmlFor="newPetGenderMale">
                            公
                          </label>

                          <input
                            type="radio"
                            className="btn-check"
                            name="newPetGender"
                            id="newPetGenderFemale"
                            value="female"
                            checked={newPet.gender === "female"}
                            onChange={(e) =>
                              setNewPet((prev) => ({ ...prev, gender: e.target.value }))
                            }
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
                            name="newPetNeuter"
                            id="newPetNeuterYes"
                            value="true"
                            checked={newPet.is_neutered === true}
                            onChange={() =>
                              setNewPet((prev) => ({ ...prev, is_neutered: true }))
                            }
                          />
                          <label className="btn pet-toggle-pill" htmlFor="newPetNeuterYes">
                            是
                          </label>

                          <input
                            type="radio"
                            className="btn-check"
                            name="newPetNeuter"
                            id="newPetNeuterNo"
                            value="false"
                            checked={newPet.is_neutered === false}
                            onChange={() =>
                              setNewPet((prev) => ({ ...prev, is_neutered: false }))
                            }
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
                          value={newPet.note}
                          onChange={(e) =>
                            setNewPet((prev) => ({ ...prev, note: e.target.value }))
                          }
                          placeholder="例如：怕生、對貓敏感、曾開刀等"
                        />
                      </div>

                      {/* 按鈕列 */}
                      <div className="col-12 d-flex justify-content-end">
                        <button
                          type="button"
                          className="btn btn-secondary me-2"
                          onClick={() => {
                            setIsAddingPet(false);
                            setNewPet({
                              name: "",
                              species: "",
                              size: "",
                              birth_date: "",
                              gender: "unknown",
                              is_neutered: false,
                              last_vaccination_date: "",
                              note: "",
                              photo_url: "",
                            });
                          }}
                        >
                          取消
                        </button>
                        <button type="submit" className="btn btn-gradint-primary">
                          送出
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>) : (
              <div className="rounded-4 p-4" style={{ backgroundColor: "#FFB22C33" }}>
                <div className="row g-4 align-items-start">
                  {/* 左側：照片 + 名字 */}
                  <div className="col-12 col-md-3 d-flex flex-column align-items-center">
                    <div className="w-100 mb-3">
                      <div className="ratio" style={{ "--bs-aspect-ratio": "133.33%" }}>
                        <img
                          src={(isEditing ? editingPetForm.photo_url : selectedPet.photo_url) || fallbackPetImage}
                          alt={isEditing ? editingPetForm.name : selectedPet.name}
                          className="w-100 h-100 rounded-4"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    </div>

                    <div className="w-100">
                      <label className="form-label">名字</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="form-control rounded-pill border border-warning"
                          name="name"
                          value={editingPetForm.name}
                          onChange={handleEditPetFieldChange}
                          style={{ backgroundColor: "#FEF3E2" }}
                          placeholder="請輸入名字"
                        />
                      ) : (
                        <input
                          type="text"
                          className="form-control rounded-pill border border-warning"
                          value={selectedPet.name || ""}
                          readOnly
                          style={{ backgroundColor: "#FEF3E2" }}
                        />
                      )}
                    </div>
                  </div>

                  {/* 右側欄位 */}
                  <div className="col-12 col-md-9">
                    <div className="row g-3">
                      {/* 種類 */}
                      <div className="col-12 col-sm-6">
                        <label className="form-label">種類</label>
                        <div className="input-group rounded-pill overflow-hidden border border-warning">
                          <span className="input-group-text border-0" style={{ backgroundColor: "#FEF3E2" }}>
                            <img src={feetIcon} alt="feet" width="20" height="20" />
                          </span>
                          <select
                            className="form-select"
                            style={{ backgroundColor: "#FEF3E2" }}
                            name="species"
                            value={(isEditing ? editingPetForm.species : selectedPet.species) || ""}
                            onChange={isEditing ? handleEditPetFieldChange : undefined}
                            disabled={!isEditing}
                          >
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
                          <span className="input-group-text border-0" style={{ backgroundColor: "#FEF3E2" }}>
                            <img src={dogIcon} alt="dog" width="20" height="20" />
                          </span>
                          <select
                            className="form-select border-0"
                            style={{ backgroundColor: "#FEF3E2" }}
                            name="size"
                            value={(isEditing ? editingPetForm.size : selectedPet.size) || ""}
                            onChange={isEditing ? handleEditPetFieldChange : undefined}
                            disabled={!isEditing}
                          >
                            <option value="small">小 - 10 公斤以下</option>
                            <option value="medium">中 - 10–20 公斤</option>
                            <option value="large">大 - 大於 20 公斤</option>
                          </select>
                        </div>
                      </div>

                      {/* 出生年（改用 date） */}
                      <div className="col-12 col-sm-6">
                        <label className="form-label">出生日期</label>
                        <div className="input-group rounded-pill overflow-hidden border border-warning">
                          <span className="input-group-text border-0" style={{ backgroundColor: "#FEF3E2" }}>
                            <img src={cakeIcon} alt="cake" width="20" height="20" />
                          </span>
                          <input
                            type="date"
                            className="form-control border-0"
                            style={{ backgroundColor: "#FEF3E2" }}
                            name="birth_date"
                            value={isEditing ? (editingPetForm.birth_date || "") : (selectedPet.birth_date || "")}
                            onChange={isEditing ? handleEditPetFieldChange : undefined}
                            readOnly={!isEditing}
                          />
                        </div>
                      </div>

                      {/* 上次施打疫苗日期 */}
                      <div className="col-12 col-sm-6">
                        <label className="form-label">上次施打疫苗日期</label>
                        <div className="input-group rounded-pill overflow-hidden border border-warning">
                          <span className="input-group-text border-0" style={{ backgroundColor: "#FEF3E2" }}>
                            <img src={calendarIcon} alt="calendar" width="20" height="20" />
                          </span>
                          <input
                            type="date"
                            className="form-control border-0"
                            style={{ backgroundColor: "#FEF3E2" }}
                            name="last_vaccination_date"
                            value={isEditing ? (editingPetForm.last_vaccination_date || "") : (selectedPet.last_vaccination_date || "")}
                            onChange={isEditing ? handleEditPetFieldChange : undefined}
                            readOnly={!isEditing}
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
                            name="gender"
                            id="petGenderMale"
                            value="male"
                            checked={(isEditing ? editingPetForm.gender : selectedPet.gender) === "male"}
                            onChange={isEditing ? handleEditPetFieldChange : undefined}
                            disabled={!isEditing}
                          />
                          <label className="btn pet-toggle-pill" htmlFor="petGenderMale">
                            公
                          </label>

                          <input
                            type="radio"
                            className="btn-check"
                            name="gender"
                            id="petGenderFemale"
                            value="female"
                            checked={(isEditing ? editingPetForm.gender : selectedPet.gender) === "female"}
                            onChange={isEditing ? handleEditPetFieldChange : undefined}
                            disabled={!isEditing}
                          />
                          <label className="btn pet-toggle-pill" htmlFor="petGenderFemale">
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
                            name="is_neutered"
                            id="petNeuterYes"
                            value="true"
                            checked={isEditing ? editingPetForm.is_neutered === true : !!selectedPet.is_neutered}
                            onChange={
                              isEditing
                                ? () =>
                                  setEditingPetForm((prev) => ({
                                    ...prev,
                                    is_neutered: true,
                                  }))
                                : undefined
                            }
                            disabled={!isEditing}
                          />
                          <label className="btn pet-toggle-pill" htmlFor="petNeuterYes">
                            是
                          </label>

                          <input
                            type="radio"
                            className="btn-check"
                            name="is_neutered"
                            id="petNeuterNo"
                            value="false"
                            checked={isEditing ? editingPetForm.is_neutered === false : selectedPet.is_neutered === false}
                            onChange={
                              isEditing
                                ? () =>
                                  setEditingPetForm((prev) => ({
                                    ...prev,
                                    is_neutered: false,
                                  }))
                                : undefined
                            }
                            disabled={!isEditing}
                          />
                          <label className="btn pet-toggle-pill" htmlFor="petNeuterNo">
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
                          name="note"
                          value={isEditing ? editingPetForm.note : (selectedPet.note || "")}
                          onChange={isEditing ? handleEditPetFieldChange : undefined}
                          readOnly={!isEditing}
                          placeholder="例如：怕生、對貓敏感、曾開刀等"
                        />
                      </div>

                      {/* 按鈕：三元運算 */}
                      <div className="col-12 d-flex justify-content-end">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              className="btn btn-gradint-primary me-2"
                              onClick={handleSavePet}
                            >
                              保存
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={handleCancelEdit}
                            >
                              取消
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-gradint-secondary"
                            onClick={handleEditPet}
                          >
                            編輯
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
};
export default PetDetailContent;