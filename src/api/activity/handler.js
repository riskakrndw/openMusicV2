class ActivityHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.getActivitiesHandler = this.getActivitiesHandler.bind(this);
  }

  async getActivitiesHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.isPlaylistExist(playlistId);
    await this._service.isPlaylistOwner(credentialId, playlistId);

    const activities = await this._service.getActivities(playlistId);

    const response = h.response({
      status: "success",
      data: {
        playlistId: playlistId,
        activities: activities,
      },
    });

    response.code(200);
    return response;
  }
}

module.exports = ActivityHandler;
