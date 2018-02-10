class User < ApplicationRecord
  has_secure_password
  has_many :orders
  has_many :user_stores
  has_many :stores, through: :user_stores
  has_one :developer

  validates :first_name, :last_name,  presence: true
  validates :email, presence: true, uniqueness: true
  validates :password, presence:true, allow_nil: true

  enum role: ["default", "admin"]

  def full_name
    first_name + " " + last_name
  end

  def date_joined
    created_at.strftime('%b. %d, %Y')
  end

  def self.user_orders
    group(:email).joins(:orders).count
  end

  def self.user_quantity_of_items_ordered
    group(:email).joins(orders: :order_items).sum(:quantity)
  end

  def key
    developer.key
  end

  def is_developer?
    !developer.nil?
  end
end
