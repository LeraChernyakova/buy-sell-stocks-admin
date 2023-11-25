import React, {useEffect, useState} from 'react';
import {Container, IconButton} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import ToolBar from "../tool-bar/tool-bar.jsx";
import BrokersTable from "./brokers-table/brokers-table.jsx";
import AddBrokerModal from "./add-broker-modal/add-broker-modal.jsx";
import './brokers.css'


const Brokers = () => {

    const [brokers, setBrokers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBrokerData, setNewBrokerData] = useState({
        name: '',
        balance: '',
    });
    const [validationError, setValidationError] = useState({
        name: '',
        balance: '',
    });
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const fetchBrokers = async () => {
        const response = await axios.get('http://localhost:8080/brokers');
        setBrokers(response.data);
    };

    const deleteBroker = async (id) => {
        await axios.delete(`http://localhost:8080/brokers/${id}`);
        await fetchBrokers();
    };

    const updateBalance = async (id, newBalance) => {
        if (newBalance >= 0) {
            await axios.patch(`http://localhost:8080/brokers/${id}/balance`, { balance: newBalance });
            await fetchBrokers();
        } else {
            setValidationError({ balance: 'Баланс не может быть отрицательным.' });
        }
    };

    const addBroker = async () => {
        setIsFormSubmitted(true);

        const errors = {};
        if (!newBrokerData.name) {
            errors.name = 'Name is required';
        }
        if (!newBrokerData.balance) {
            errors.balance = 'Start Capital is required';
        }

        if (Object.keys(errors).length > 0) {
            setValidationError(errors);
            return;
        }

        await axios.post('http://localhost:8080/brokers', {
            ...newBrokerData
        });
        await fetchBrokers();
        closeModal();
    };


    useEffect(() => {
        fetchBrokers();
    }, []);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewBrokerData({
            name: '',
            balance: '',
        });
        setValidationError({
            name: '',
            balance: '',
        });
        setIsFormSubmitted(false);
    };

    return (
        <>
            <ToolBar />
            <Container sx={{ width: '100%', marginTop: 3 }}>
                <BrokersTable brokers={brokers} deleteBroker={deleteBroker} updateBalance={updateBalance} />
            </Container>

            <Container sx={{ marginTop: 2, textAlign: 'center' }}>
                <IconButton color="warn" aria-label="add" onClick={openModal}>
                    <AddIcon />
                </IconButton>
            </Container>

            <AddBrokerModal
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                newBrokerData={newBrokerData}
                validationError={validationError}
                isFormSubmitted={isFormSubmitted}
                setNewBrokerData={setNewBrokerData}
                addBroker={addBroker}
            />
        </>
    );
};

export default Brokers;
