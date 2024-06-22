import { Injectable, inject } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilsSvc = inject(UtilsService);

  // Autenticar Usuario
  getAuth(){
    return getAuth();
  }

  // Acceso de Usuario
  signIn(user : User){
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // Registro de Usuario
  signUp(user : User){
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // Actualizar Usuario
  updateUser(displayName: string){
    return updateProfile(getAuth().currentUser, {displayName})
  }

  // Restablecer contraseña mediante Email
  sendRecoveryEmail(email: string){
    return sendPasswordResetEmail(getAuth(), email);
  }

  // Cerrar Sesión
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

                    // Base de datos 
  // Listar Colección
  getCollectionData(path: string, collectionQuery?: any){
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), {idField: 'id'});
  }

  // Documento registro
  setDocument(path: string, data: any){
    return setDoc(doc(getFirestore(), path), data);
  }

 // Actualizar Documento 
 updateDocument(path: string, data: any){
  return updateDoc(doc(getFirestore(), path), data);
}

// Eliminar Documento 
deleteDocument(path: string){
  return deleteDoc(doc(getFirestore(), path));
}

  // Consultar Documento
 async getDocument(path: string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  // Agregar un documento
  addDocument(path: string, data: any){
    return addDoc(collection(getFirestore(), path), data);
  }

                  // Almacenamiento
  //Subir Imagen
  async uploadImage(path: string, data_url: string){
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path))
    })
  }

  //Obtener la ruta de la imagen actualizada
  async getFilePath(url: string){
    return ref(getStorage(), url).fullPath
  }

  //ELiminar archivo
  deleteFile(path: string){
    return deleteObject(ref(getStorage(), path));
  }
}
