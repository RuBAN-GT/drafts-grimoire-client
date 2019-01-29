# Common settings
set :application, 'grimoire-client'
set :repo_url, 'git@bitbucket.org:DetemiroTM/client.git'
set :branch, (ENV['BRANCH'] || 'master')
set :log_level, :error

# Node settings
set :linked_dirs, %w(node_modules public)
