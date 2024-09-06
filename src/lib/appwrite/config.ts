import { Client, Avatars, Databases, Storage, Account } from 'appwrite'

export const appwriteConfig = {
    projectID: '66db54a00031e3ab014d',
    url: 'https://cloud.appwrite.io/v1'
}

export const client = new Client()

client.setProject(appwriteConfig.projectID);
client.setEndpoint(appwriteConfig.url)

export const account = new Account(client)
export const storage = new Storage(client)
export const avatar = new Avatars(client)
export const databases = new Databases(client)