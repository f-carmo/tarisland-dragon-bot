import fs from "fs/promises";
import { UserCharacter } from "../models/user-character";

export class ChecklistService {
    private static caminho = "src/assets/checklist.json";

    static async fileToJsonObject() : Promise<UserCharacter[]> {
        
        const stats = await fs.stat(this.caminho);
        if (stats.size === 0) {
            return [];
        }

        return JSON.parse(await fs.readFile(this.caminho, "utf-8"));
    }

    static async save(novoObjeto: any) {
        try {
            await fs.writeFile(this.caminho, JSON.stringify(novoObjeto, null, 2), "utf-8");
        } catch (error) {
            console.error(error);
        }
    }

    static async getUserInfo(list: UserCharacter[], discordUsername: any) {
        if (Array.isArray(list)) {
            const userCharacter = list.find((userCharacter: UserCharacter) => userCharacter.discordUsername == discordUsername);

            if (!userCharacter) {
                return this.createNewUserInfo(discordUsername);                
            }

            return userCharacter
        } else {
            list = [];
            return this.createNewUserInfo(discordUsername);
        }
    }

    static async addCharacterToList(userCharacter: UserCharacter, characterName: string) {
        if (!userCharacter.listOfCharacters.includes(characterName.toLowerCase())) {
            userCharacter.listOfCharacters.push(characterName.toLowerCase());
        }
    }

    static async removeCharacterFromList(userCharacter: UserCharacter, characterName: string) {
        const index = userCharacter.listOfCharacters.indexOf(characterName.toLowerCase())
        if (index !== -1) {
            userCharacter.listOfCharacters.splice(index, 1);
        }
    }

    static createNewUserInfo(discordUsername: string) {
        const newUserCharacter: UserCharacter = {
            discordUsername: discordUsername,
            listOfCharacters: []
        }
        return newUserCharacter;
    }

    static updateChecklist(checklist: UserCharacter[], updatedUserCharacter: UserCharacter) {
        const index = checklist.findIndex(userCharacter => userCharacter.discordUsername == updatedUserCharacter.discordUsername);

        console.log("index>", index);
        if (index !== -1) {
            checklist[index] = updatedUserCharacter;
        } else {
            checklist.push(updatedUserCharacter);
        }
    }

    static countCharacters(checklist: UserCharacter[]) {
        let count = 0;
        checklist.forEach((userCharacter: UserCharacter) => {
            count += userCharacter.listOfCharacters.length;
        });
        return count;
    }

    static formatMessage(checklist: UserCharacter[]) {
        const mensagensFinal = [];
        let stringFinal = `**Lista atual de checks**\nTotal de personagens: ${this.countCharacters(checklist)}\n`;
        
        checklist.forEach((userCharacter: UserCharacter) => {
            if (stringFinal.length >= 1500) {
                mensagensFinal.push(stringFinal);
                stringFinal = '';
            }
            stringFinal += `**${userCharacter.discordUsername}**: \n`;

            userCharacter.listOfCharacters.forEach((char: string) => {
                stringFinal += `\t• ${char}\n`;
            })
            stringFinal += `\n`;
        });

        mensagensFinal.push(stringFinal);
        return mensagensFinal;
    }
}