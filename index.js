const core = require('@actions/core');

async function run() {
    try {
        const sonarUrl = core.getInput('sonar_url', { required: true });
        const sonarToken = core.getInput('sonar_token', { required: true });
        const projectKey = core.getInput('project_key', { required: true });

        core.info(`🗑️ Intentando eliminar el proyecto de SonarQube: ${projectKey}`);

        const authHeader = 'Basic ' + Buffer.from(sonarToken + ':').toString('base64');

        const response = await fetch(`${sonarUrl}/api/projects/delete?project=${projectKey}`, {
            method: 'POST',
            headers: { 'Authorization': authHeader }
        });

        if (response.ok || response.status === 204) {
            core.info(`✅ Proyecto ${projectKey} eliminado exitosamente de SonarQube.`);
        } else if (response.status === 404) {
            core.warning(`⚠️ El proyecto ${projectKey} no se encontró. Quizás ya fue eliminado.`);
        } else {
            const errorText = await response.text();
            core.setFailed(`❌ Fallo al eliminar el proyecto. HTTP ${response.status}: ${errorText}`);
        }
    } catch (error) {
        core.setFailed(`❌ Error grave en la Action: ${error.message}`);
    }
}

run();