class Api::RoomUsersController < ApplicationController
  def create
    @room_user = RoomUser.new(room_user_params)
    @room_user.user_id = current_user.id
    @room = Room.find_by(id: room_user_params[:room_id])
    if @room && @room.channel && @room_user.save
      render "api/rooms/show"
    else
      render json: @room_user.errors, status: 418
    end
  end

  def add
    @room_user = RoomUser.new(room_user_params)
    @room = Room.find_by(id: room_user_params[:room_id])
    @user = User.find_by(id: room_user_params[:user_id])
    authorized = this_is_a_new(@room) || @room.users.include?(current_user)
    if @room && @user && authorized && @room_user.save
      render "api/rooms/show"
    else
      render json: @room_user.errors, status: 418
    end
  end

  def destroy
    room_user = RoomUser.find(params[:id])
    @room = room_user.room
    room_user.destroy
    render "api/rooms/show"
  end

  private
  def room_user_params
    params.require(:room_user).permit(:room_id, :user_id)
  end

  def this_is_a_new(room)
    room.users.empty?
  end
end
