# publish.ps1
# Place ce fichier à la racine AgentIA_Local/

# 1. Se positionner dans le dossier du script
Set-Location -Path (Split-Path -Parent $MyInvocation.MyCommand.Definition)

# 2. Générer ou mettre à jour le .gitignore
$gitignoreContent = @"
# Node / Vite
node_modules/
dist/
.vite/

# React
build/
coverage/

# Python / FastAPI
__pycache__/
*.py[cod]
chroma_db/
uploads/

# Exclure les DB Chroma volumineuses
backend/db/
backend/vectordb/

# IDEs & OS
.vscode/
*.log
.DS_Store

# Variables d'environnement
.env
"@
Set-Content -Path ".gitignore" -Value $gitignoreContent -Encoding UTF8
Write-Host ".gitignore généré."

# 3. Supprimer l'ancien dépôt Git (si existant)
if (Test-Path ".git") {
    Remove-Item -Recurse -Force ".git"
    Write-Host "Ancien dossier .git supprimé."
}

# 4. Initialiser un nouveau dépôt Git
git init | Out-Null
Write-Host "Dépôt Git initialisé."

# 5. Retirer de l'index Git les dossiers de base volumineux (sans les supprimer localement)
if (Test-Path "backend/db") {
    git rm -r --cached "backend/db" | Out-Null
    Write-Host "backend/db retiré de l’index Git."
}
if (Test-Path "backend/vectordb") {
    git rm -r --cached "backend/vectordb" | Out-Null
    Write-Host "backend/vectordb retiré de l’index Git."
}

# 6. Ajouter tous les fichiers et effectuer le commit initial
git add -A
git commit -m "Initial commit: projet complet et .gitignore" | Out-Null
Write-Host "Premier commit réalisé."

# 7. Configurer la télécommande GitHub
$remoteUrl = "https://github.com/Gbonetto/AgentIA_Local.git"
git remote add origin $remoteUrl
Write-Host "Remote 'origin' configuré sur $remoteUrl"

# 8. Renommer la branche principale en main et pousser en force
git branch -M main
git push -f origin main | Out-Null
Write-Host "Code poussé sur GitHub (branche main)."
