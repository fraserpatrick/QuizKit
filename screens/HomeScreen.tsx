import React, { useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import database, { User } from './../DatabaseController';

export default function HomeScreen() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setUsers(await database.getUsers());
            } catch (error) {
                console.error('Error loading users:', error);
            }
        };

        loadUsers();
    }, []);

    const resetDatabase = async () => {
        try {
            await database.databaseReset();
            setUsers([]);
            alert('Database has been reset.');
            console.log('Database reset successfully.');
        } catch (error) {
            console.error('Error resetting database:', error);
            alert('Failed to reset database.');
        }
    };

    const listUsers = () => {
        if (users.length === 0) {
            console.log("No users found");
        } else {
            users.forEach((user) => {
                console.log("Username: " + user.username + "  " + "Password: " + user.password + "  " + "Security Question: " + user.securityQuestion + "  " + "Security Answer: " + user.securityAnswer);
            });
        }
    };    

    return (
        <View>
            <Button title="List Users" onPress={listUsers} />
            <Button title="Reset Database" onPress={resetDatabase} />
        </View>
    );
}