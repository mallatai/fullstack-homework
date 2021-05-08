Rails.application.routes.draw do
  resources :fields, only: [:index]
  post 'humus_balance', to: 'humus_balance#calculate'
  resources :crops, only: [:index]
end
