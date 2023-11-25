import { AppBar, Button, Toolbar } from "@mui/material";
import React from "react";

const ToolBar = () => {
    return (
        <AppBar position="static" style={{ backgroundColor: '#0a0d3a', width: '100%' }}>
            <Toolbar>
                <Button color="inherit" href="/brokers" style={{ color: 'white' }}>
                    Список брокеров
                </Button>
                <Button color="inherit" href="/stocks" style={{ color: 'white' }}>
                    Список акций
                </Button>
                <Button color="inherit" href="/settings" style={{ color: 'white' }}>
                    Настройка биржи
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default ToolBar;