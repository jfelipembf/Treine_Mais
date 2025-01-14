import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { useFirebase } from '../../contexts/FirebaseContext';
import BasicLayout from '../../components/BasicLayout/BasicLayout';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaCamera, FaUpload } from 'react-icons/fa';
import { doc, updateDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../constants/collections';
import './Profile.css';

const Profile = () => {
  const { currentUser } = useAuth();
  const { user: userData, loading: userLoading } = useUser();
  const { db } = useFirebase();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedData, setEditedData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    photo: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  useEffect(() => {
    if (userData) {
      setEditedData({
        name: userData.displayName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        gender: userData.gender || '',
        photo: userData.photoURL || '',
        address: userData.address || {
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: ''
        }
      });
    }
  }, [userData]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const userRef = doc(db, COLLECTIONS.USERS, currentUser.uid);
      
      // Criar objeto apenas com campos alterados
      const updates = {};
      if (editedData.name !== userData.displayName) updates.displayName = editedData.name;
      if (editedData.phone !== userData.phone) updates.phone = editedData.phone;
      if (editedData.gender !== userData.gender) updates.gender = editedData.gender;
      if (editedData.photo !== userData.photoURL) updates.photoURL = editedData.photo;
      
      // Verificar se houve alterações no endereço
      const addressChanged = JSON.stringify(editedData.address) !== JSON.stringify(userData.address);
      if (addressChanged) updates.address = editedData.address;
      
      // Só atualizar se houver mudanças
      if (Object.keys(updates).length > 0) {
        updates.updatedAt = new Date();
        await updateDoc(userRef, updates);
      }
      
      setIsEditing(false);
      toast.success('Salvo!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      toast.error('Erro ao salvar', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };
  const handleCancel = () => {
    setEditedData({
      name: userData.displayName || '',
      email: userData.email || '',
      phone: userData.phone || '',
      gender: userData.gender || '',
      photo: userData.photoURL || '',
      address: userData.address || {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: ''
      }
    });
    setIsEditing(false);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData(prev => ({
          ...prev,
          photo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [section, key] = field.split('.');
      setEditedData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value
        }
      }));
    } else {
      setEditedData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const renderField = (label, value, Icon, field) => {
    return (
      <div className="profile-field">
        <div className="field-content">
          <label>
            <Icon /> {label}
          </label>
          {isEditing ? (
            <input
              type="text"
              value={field.includes('.') ? editedData[field.split('.')[0]][field.split('.')[1]] : editedData[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              className="edit-input"
              disabled={field === 'email'}
            />
          ) : (
            <span>{value || '-'}</span>
          )}
        </div>
      </div>
    );
  };

  if (userLoading) {
    return (
      <BasicLayout>
        <div className="profile-page">
          <div className="loading">Carregando...</div>
        </div>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout>
      <ToastContainer />
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-photo-section">
            <div className="profile-photo-container">
              <img 
                src={isEditing ? editedData.photo : (userData?.photoURL || 'https://via.placeholder.com/150')} 
                alt="Foto de perfil" 
                className="profile-photo" 
                onClick={handlePhotoClick}
              />
            </div>
            <h1>{isEditing ? editedData.name : (userData?.displayName || 'Usuário')}</h1>
            {isEditing && (
              <label htmlFor="photo-upload" className="upload-button">
                <FaUpload /> Carregar Nova Foto
              </label>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              accept="image/*"
              id="photo-upload"
              className="photo-upload"
            />
          </div>
          {!isEditing && (
            <button onClick={handleEdit} className="edit-button">
              <FaEdit /> Editar Perfil
            </button>
          )}
        </div>

        <div className="profile-content">
          <div className="profile-section personal-info">
            <h2>Informações Pessoais</h2>
            <div className="section-content">
              {renderField('Nome', userData?.displayName, FaUser, 'name')}
              {renderField('E-mail', userData?.email, FaEnvelope, 'email')}
              {renderField('Telefone', userData?.phone, FaPhone, 'phone')}
              {renderField('Gênero', userData?.gender, FaUser, 'gender')}
            </div>
          </div>

          <div className="profile-section address-info">
            <h2>Endereço</h2>
            <div className="section-content">
              {renderField('Rua', userData?.address?.street, FaMapMarkerAlt, 'address.street')}
              {renderField('Número', userData?.address?.number, FaMapMarkerAlt, 'address.number')}
              {renderField('Complemento', userData?.address?.complement, FaMapMarkerAlt, 'address.complement')}
              {renderField('Bairro', userData?.address?.neighborhood, FaMapMarkerAlt, 'address.neighborhood')}
              {renderField('Cidade', userData?.address?.city, FaMapMarkerAlt, 'address.city')}
              {renderField('Estado', userData?.address?.state, FaMapMarkerAlt, 'address.state')}
              {renderField('CEP', userData?.address?.zipCode, FaMapMarkerAlt, 'address.zipCode')}
            </div>
          </div>
        </div>

        {isEditing ? (
          <div className="bottom-buttons">
            <button 
              onClick={handleSave} 
              className="action-button save-button"
              disabled={isSaving}
            >
              {isSaving ? (
                "Salvando..."
              ) : (
                <>
                  <FaSave /> Salvar
                </>
              )}
            </button>
            <button 
              onClick={handleCancel} 
              className="action-button cancel-button"
              disabled={isSaving}
            >
              <FaTimes /> Cancelar
            </button>
          </div>
        ) : (
          <div className="bottom-buttons">
          </div>
        )}
      </div>
    </BasicLayout>
  );
};

export default Profile;
