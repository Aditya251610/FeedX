import { Client, Avatars, Databases, Storage, Account } from 'appwrite'

export const appwriteConfig = {
    projectID: '66db54a00031e3ab014d',
    url: 'https://cloud.appwrite.io/v1',
    databaseId: '66dbc6f30038c45a38f0',
    storageId: '66dbc68300003352f57f',
    userCollectionId: '66dbc77c001b6005bc61',
    postCollectionId: '66dbc738002cb947a0cd',
    svaeCollectionId: '66dbc79a0002fb679573',
}

export const client = new Client()

client.setProject(appwriteConfig.projectID);
client.setEndpoint(appwriteConfig.url)

export const account = new Account(client)
export const storage = new Storage(client)
export const avatar = new Avatars(client)
export const databases = new Databases(client)