const { autoUpdater } = require("electron-updater")

const { dialog } = require('electron')

// Configuration du module de journalisation pour l'autoUpdater en utilisant "electron-log"
autoUpdater.logger = require("electron-log")

// Définition du niveau de journalisation pour le fichier à "info"
autoUpdater.logger.transports.file.level = "info"

// Désactivation du téléchargement automatique des mises à jour
autoUpdater.autoDownload = false

// Export de la fonction responsable de la vérification des mises à jour
module.exports = () => {
    // Vérification des mises à jour disponibles
    autoUpdater.checkForUpdates()

    // Écoute de l'événement 'update-available' qui est déclenché lorsqu'une mise à jour est disponible
    autoUpdater.on('update-available', () => {
        // Affichage d'une boîte de dialogue informant l'utilisateur de la disponibilité d'une mise à jour
        dialog.showMessageBox({
            type: 'info',
            title: 'Mise à jour disponible',
            message: 'Une mise à jour est disponible, voulez-vous l\'installer maintenant ?',
            buttons: ['Mettre à jour', 'Non']
        }).then(result => {
            // Gestion de la réponse de l'utilisateur à la boîte de dialogue
            let buttonIndex = result.response
            if (buttonIndex === 0 ){
                // Si l'utilisateur choisit de mettre à jour, déclencher le téléchargement de la mise à jour
                autoUpdater.downloadUpdate()
            }
        })
    })
    // Écoute de l'événement 'update-downloaded' déclenché lorsqu'une mise à jour est téléchargée avec succès
    autoUpdater.on('update-downloaded', () => {
        // Affichage d'une boîte de dialogue informant l'utilisateur que la mise à jour est terminée
        dialog.showMessageBox({
            type: 'info',
            title: 'Mise à jour terminée',
            message: 'Redémarrer l\'application maintenant pour profiter de la nouvelle version ?',
            buttons: ['Oui', 'Non']
        }).then(result => {
            // Gestion de la réponse de l'utilisateur à la boîte de dialogue
            let buttonIndex = result.response
            if (buttonIndex === 0 ){
                // Si l'utilisateur choisit 'Oui', quitter et installer la mise à jour
                autoUpdater.quitAndInstall(false, true)
            }
        })
    })
}
