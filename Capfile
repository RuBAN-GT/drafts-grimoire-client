require 'capistrano/setup'
require 'capistrano/deploy'

require 'capistrano/scm/git'
install_plugin Capistrano::SCM::Git

require 'capistrano/nvm'
require 'capistrano/passenger'

Dir.glob('config/tasks/*.rake').each { |r| import r }
