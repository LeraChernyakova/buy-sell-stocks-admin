import React from 'react';
import { Typography, TextField, Button, Box, Modal } from '@mui/material';

const AddBrokerModal = ({ isModalOpen, closeModal, newBrokerData, isFormSubmitted, setNewBrokerData, addBroker, validationError }) => {
    return (
        <Modal open={isModalOpen} onClose={closeModal}>
            <Box className="modalContainer">
                <Typography className="modalTitle" variant="h6" component="div" gutterBottom>
                    Добавление нового брокера
                </Typography>
                <TextField
                    className={`modalTextField ${validationError.name && 'error'}`}
                    label="Name"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={newBrokerData.name}
                    onChange={(e) => {
                        setNewBrokerData({ ...newBrokerData, name: e.target.value });
                    }}
                    required
                    error={isFormSubmitted && (!newBrokerData.name || !/^[a-zA-Z\s]+$/.test(newBrokerData.name))}
                    helperText={
                        (isFormSubmitted && !newBrokerData.name && 'Данное поле обязательно!') ||
                        (isFormSubmitted && !/^[a-zA-Z\s]+$/.test(newBrokerData.name) && 'Используются недопустимые символы!')
                    }
                />
                <TextField
                    className={`modalTextField ${validationError.balance && 'error'}`}
                    label="Start Capital"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    type="number"
                    value={newBrokerData.balance}
                    onChange={(e) => {
                        setNewBrokerData({ ...newBrokerData, balance: e.target.value });
                    }}
                    required
                    error={isFormSubmitted && (!newBrokerData.balance || newBrokerData.balance < 0)}
                    helperText={
                        (isFormSubmitted && !newBrokerData.balance && 'Данное поле обязательно!') ||
                        (isFormSubmitted && newBrokerData.balance < 0 && 'Значение не может быть отрицательным!')
                    }
                />
                <Button className="modalButton" variant="contained" color="primary" onClick={addBroker}>
                    Добавить
                </Button>
            </Box>
        </Modal>
    );
};
export default AddBrokerModal;
