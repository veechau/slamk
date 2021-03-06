Rails.application.routes.draw do
  root to: 'static_pages#root'
  get 'api/guest', :to => 'api/users#create_guest'
  get 'api/users', :to => 'api/users#index'
  get 'api/rooms/title', :to => 'api/rooms#show_room'
  post 'api/room_users/add', :to => 'api/room_users#add'
  get 'api/channels/joinable', :to => 'api/rooms#joinable'
  get 'api/favorites/allmessages', :to => 'api/messages#allmessages'

  namespace :api, defaults: {format: :json} do
    resources :messages, only: [:index, :create, :update, :destroy]
    resources :room_users, only: [:create, :destroy]
    resources :rooms, only: [:index, :create, :update, :destroy]
    resource :user, only: [:create]
    resource :session, only: [:create, :destroy, :show]
    resources :favorites, only: [:index, :create, :destroy]
  end
end
